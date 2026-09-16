/**
 * Přírodopis 6. ročník — Řasy: stavba, zástupci, význam (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3). Každá položka má vlastní
 * znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • stavba vyšších rostlin přenesená na řasy (kořen, stonek, list; kořeny sají ze dna);
 *  • záměna řas se sinicemi (buňka bez jádra) nebo s houbami (bez chloroplastů);
 *  • záměna zástupců podle tvaru (jedna buňka × nevětvené × větvené vlákno × velká
 *    mořská stélka) a chaluha umístěná do sladké vody;
 *  • řasy „jen škodí“ nebo kyslík jen spotřebovávají a nevyrábějí; neznalost potravního řetězce;
 *  • příchytný útvar chaluhy považovaný za kořen, který saje vodu.
 *
 *  • L1 — zapamatování: přímá otázka k jednomu pojmu.
 *  • L2 — použití: znak → zástupce, prostředí, význam; srovnání dvou skupin.
 *  • L3 — přenos: organismus z popisu bez jména, chyba v popisu, srovnání dvou řas,
 *    důsledek změny (tma, utržení, úhyn), rozhodnutí o tvrzení.
 *
 * Znění otázek nepoužívá slova odvozená od jména řasy (šroubovice, vlas), aby se
 * zástupce nedal uhodnout podle názvu.
 *
 * Sporné věci (agar, vodní květ, stanoviště zelenivky, procenta kyslíku) klíčem nejsou.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

// Zástupci — distraktory k „která řasa…“ (chyba: záměna podle tvaru a prostředí).
const ZELENIVKA: Distractor = { value: "Zelenivka", why: "Zelenivka je jednobuněčná zelená řasa: jediná drobná buňka, netvoří vlákno ani velkou stélku." };
const SROUBATKA: Distractor = { value: "Šroubatka", why: "Šroubatka tvoří nevětvená zelená vlákna ve sladké vodě a chloroplast má stočený do šroubovice." };
const ZABI_VLAS: Distractor = { value: "Žabí vlas", why: "Žabí vlas tvoří větvená zelená vlákna ve sladké vodě. Není jednobuněčný ani mořský." };
const CHALUHA: Distractor = { value: "Chaluha", why: "Chaluha je velká hnědá mořská řasa, kamenů se drží příchytnými útvary. Ve sladké vodě nežije a z jedné buňky není." };

const BEZ_KORENU = "Řasa má stélku, která není rozdělená na kořen, stonek a list. Vodu a živiny přijímá celým povrchem.";
const SINICE = "Sinice nemají jádro, dědičná informace je u nich volně v buňce. Řasy jádro mají.";
const HOUBY = "Houby nemají chloroplasty a fotosyntézu nedělají. Řasy chloroplasty mají.";
const FOTOSYNTEZA = "Při fotosyntéze řasy spotřebovávají oxid uhličitý a uvolňují kyslík.";

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka → pojem ────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Jak se nazývá tělo řasy, které není rozdělené na kořen, stonek a list?",
    correct: "Stélka",
    distractors: [
      { value: "Lodyha", why: "Lodyha je stonek s listy u vyšších rostlin. Řasa stonek ani listy nemá." },
      { value: "Oddenek", why: "Oddenek je podzemní stonek vyšších rostlin, třeba kapradin. Řasa stonek nemá." },
      { value: "Plodnice", why: "Plodnice je část houby, kterou sbíráme v lese. Řasa není houba." },
    ],
    hints: [
      "Hledáš pojem pro nerozčleněné tělo. Které z možností patří k vyšším rostlinám nebo k houbám?",
      "Lodyha a oddenek jsou druhy stonku, plodnice roste u hub. Tělo řasy nemá žádné orgány, je to jeden celek, který se stejně jmenuje i u lišejníků.",
    ],
    explanation: "Tělo řasy se nazývá stélka. Není rozdělené na kořen, stonek a list. V učebnicích se řasy řadí k nižším rostlinám. Lodyha a oddenek jsou stonky vyšších rostlin, plodnice patří houbám.",
  },
  {
    q: "Ve které části buňky probíhá u řas fotosyntéza?",
    correct: "V chloroplastu",
    distractors: [
      { value: "V jádře", why: "Jádro řídí život buňky a uchovává dědičnou informaci. Fotosyntéza v něm neprobíhá." },
      { value: "Ve vakuole", why: "Vakuola je zásobárna vody a rozpuštěných látek. Fotosyntéza v ní neprobíhá." },
      { value: "V buněčné stěně", why: "Buněčná stěna buňku chrání a zpevňuje. Fotosyntéza v ní neprobíhá." },
    ],
    hints: [
      "Fotosyntéza potřebuje zelené barvivo, které zachytí světlo. Ve které části buňky je?",
      "Jádro buňku řídí, stěna ji chrání a vakuola uchovává vodu. Hledáš zelené tělísko, které dává řase i listu barvu.",
    ],
    explanation: "Fotosyntéza probíhá v chloroplastech, které obsahují zelené barvivo chlorofyl. Jádro řídí buňku, stěna ji chrání a vakuola uchovává vodu a látky.",
  },
  {
    q: "Kde žijí chaluhy?",
    correct: "V moři u skalnatých pobřeží",
    distractors: [
      { value: "V rybnících a pomalých potocích", why: "Ve sladké vodě žijí šroubatka a žabí vlas. Chaluhy jsou mořské řasy." },
      { value: "Na vlhké kůře stromů v lese", why: "Na kůře stromů chaluhy nežijí, potřebují slanou vodu. Jsou to mořské řasy." },
      { value: "Ve vlhké půdě na polích", why: "V půdě chaluhy nežijí. Jsou to velké mořské řasy." },
    ],
    hints: [
      "Chaluhy patří k největším řasám. Kde je dost vody, aby tak velká stélka mohla růst?",
      "Chaluhy jsou hnědé řasy, které rostou přichycené ke kamenům a vlny je někdy vyplaví na břeh. Ve sladké vodě u nás je nenajdeš.",
    ],
    explanation: "Chaluhy jsou velké hnědé řasy, které žijí v moři, hlavně u skalnatých pobřeží, kde se příchytnými útvary drží kamenů. Ve sladké vodě žijí jiné řasy, třeba šroubatka.",
  },
  {
    q: "Jak vypadá tělo šroubatky?",
    correct: "Nevětvené zelené vlákno",
    distractors: [
      { value: "Jediná drobná kulovitá buňka", why: "Tak vypadá zelenivka. Šroubatka tvoří vlákno z mnoha buněk za sebou." },
      { value: "Větvená zelená vlákna jako chomáč", why: "Větvená vlákna tvoří žabí vlas. Vlákno šroubatky se nevětví." },
      { value: "Velká hnědá stélka s příchytnými útvary", why: "Tak vypadá chaluha z moře. Šroubatka je zelená sladkovodní řasa." },
    ],
    hints: [
      "Rozhodni nejdřív, jestli jde o jednu buňku, o vlákno, nebo o velkou stélku. Pak se zeptej, jestli se tělo větví.",
      "Šroubatka dostala jméno podle tvaru chloroplastu v buňkách. Buňky leží v řadě za sebou jako korálky na niti a z řady nevyrůstají žádné postranní výběžky.",
    ],
    explanation: "Šroubatka tvoří nevětvená zelená vlákna z buněk seřazených za sebou. V každé buňce je chloroplast stočený do šroubovice. Jednobuněčná je zelenivka, větvená vlákna má žabí vlas a hnědou stélku chaluha.",
  },
  {
    q: "Ze kolika buněk se skládá tělo zelenivky?",
    correct: "Z jedné buňky",
    distractors: [
      { value: "Z dlouhé řady buněk ve vlákně", why: "Vlákno z řady buněk tvoří šroubatka nebo žabí vlas. Zelenivka je jednobuněčná." },
      { value: "Z mnoha buněk ve velké stélce", why: "Velkou mnohobuněčnou stélku má chaluha. Zelenivka je jednobuněčná." },
      { value: "Z buněk tvořících kořen a lístky", why: `Kořen ani lístky řasy nemají. ${BEZ_KORENU}` },
    ],
    hints: [
      "Zelenivka je tak drobná, že jednotlivě ji uvidíš jen mikroskopem. Co to říká o počtu buněk?",
      "Pod mikroskopem vypadá zelenivka jako samostatná zelená kulička s jádrem a chloroplastem. Netvoří vlákno ani stélku a všechny životní děje zvládne sama.",
    ],
    explanation: "Zelenivka je jednobuněčná zelená řasa: celé její tělo tvoří jediná buňka s jádrem a chloroplastem. Vlákna tvoří šroubatka a žabí vlas, velkou stélku chaluha.",
  },
  {
    q: "Jaký plyn řasy při fotosyntéze uvolňují?",
    correct: "Kyslík",
    distractors: [
      { value: "Oxid uhličitý", why: `Oxid uhličitý řasy při fotosyntéze naopak spotřebovávají. ${FOTOSYNTEZA}` },
      { value: "Dusík", why: `Dusíku je ve vzduchu nejvíc, ale fotosyntéza ho nevytváří. ${FOTOSYNTEZA}` },
      { value: "Metan", why: `Metan vzniká při hnití v bahně, ne při fotosyntéze. ${FOTOSYNTEZA}` },
    ],
    hints: [
      "Při fotosyntéze vzniká plyn, který potřebují k dýchání ryby i lidé.",
      "Fotosyntéza jeden plyn ze vzduchu nebo z vody odebírá a jiný vrací. Ten, který odebírá, vydechujeme. Hledáš ten druhý, bez kterého bychom se udusili.",
    ],
    explanation: "Při fotosyntéze řasy odebírají oxid uhličitý a uvolňují kyslík. Díky tomu je ve vodě kyslík pro ryby a další živočichy.",
  },
  {
    q: "Která skupina organismů patří k nižším rostlinám?",
    correct: "Řasy",
    distractors: [
      { value: "Houby", why: `Houby nejsou rostliny, tvoří samostatnou říši. ${HOUBY}` },
      { value: "Sinice", why: `Sinice nejsou rostliny, stojí blízko bakteriím. ${SINICE}` },
      { value: "Prvoci", why: "Prvoci nejsou rostliny. Jsou to jednobuněčné organismy, které se většinou živí jako živočichové." },
    ],
    hints: [
      "Nižší rostliny dělají fotosyntézu a mají buňky s jádrem. Kterou skupinu tyto dva znaky vyřadí?",
      "Houby chloroplasty nemají, sinice nemají jádro a prvoci se většinou živí jako živočichové. Hledáš skupinu s tělem bez kořene, stonku a listu, která žije hlavně ve vodě.",
    ],
    explanation: "V učebnicích se k nižším rostlinám řadí řasy. Mají buňky s jádrem a chloroplasty a tělo (stélku) bez kořene, stonku a listu. Houby nejsou rostliny, sinice nemají jádro a prvoci nejsou rostliny.",
  },
  {
    q: "Co mají řasy v buňce navíc oproti houbám?",
    correct: "Chloroplasty",
    distractors: [
      { value: "Jádro", why: "Jádro mají řasy i houby. Rozdíl je jinde." },
      { value: "Buněčnou stěnu", why: "Buněčnou stěnu mají řasy i houby. Rozdíl je jinde." },
      { value: "Cytoplazmu", why: "Cytoplazmu má každá buňka, houby také. Rozdíl je jinde." },
    ],
    hints: [
      "Porovnej, jak se řasy a houby živí. Která z nich si umí vyrobit živiny ze světla?",
      "Jádro, stěnu i cytoplazmu mají buňky obou skupin. Hledáš zelená tělíska, ve kterých probíhá fotosyntéza. Houba je nemá, a proto žije z hotových látek.",
    ],
    explanation: "Řasy mají chloroplasty a dělají fotosyntézu. Houby chloroplasty nemají a živí se hotovými látkami. Jádro, buněčnou stěnu i cytoplazmu mají obě skupiny.",
  },
  {
    q: "Jakou barvu mají chaluhy?",
    correct: "Hnědou",
    distractors: [
      { value: "Jasně zelenou", why: "Jasně zelené jsou zelené řasy, třeba šroubatka. Chaluhy patří k hnědým řasám." },
      { value: "Modrozelenou", why: "Modrozelené bývají sinice. Chaluhy jsou hnědé řasy." },
      { value: "Sytě červenou", why: "Červené jsou ruduchy, jiná skupina mořských řas. Chaluhy jsou hnědé." },
    ],
    hints: [
      "Chaluhy mají kromě zeleného barviva ještě další, které zelenou barvu zakryje. Vzpomeň si, do které skupiny řas patří.",
      "Řasy se dělí i podle barvy: zelené, červené a ještě jedna skupina velkých mořských řas, jejichž stélka připomíná barvou suché listí.",
    ],
    explanation: "Chaluhy jsou hnědé řasy: mají zelený chlorofyl, ale ten je překrytý hnědým barvivem. Zelené jsou třeba šroubatka a zelenivka, červené ruduchy a modrozelené bývají sinice.",
  },
  {
    q: "Co platí o kořenech řas?",
    correct: "Řasy nemají žádné kořeny",
    distractors: [
      { value: "Řasy mají kořeny jen ve velké stélce", why: `Ani velké chaluhy kořeny nemají, drží se příchytnými útvary. ${BEZ_KORENU}` },
      { value: "Řasy mají kořeny ukryté v bahně", why: `Řasa nemá kořeny ani v bahně. ${BEZ_KORENU}` },
      { value: "Řasy mají kořeny, jen velmi tenké", why: `Tenká vlákna řas nejsou kořeny. ${BEZ_KORENU}` },
    ],
    hints: [
      "Vzpomeň si, jak se jmenuje tělo řasy a na jaké části je rozdělené.",
      "Nižší rostliny se od vyšších liší právě tím, že jejich tělo nemá orgány. Příchytné útvary chaluh jen drží stélku na kameni.",
    ],
    explanation: "Řasy kořeny nemají. Jejich tělo je stélka bez kořene, stonku a listu. Velké chaluhy se ke kamenům drží příchytnými útvary, vodu a živiny ale přijímají celým povrchem.",
  },
  {
    q: "Kde žije šroubatka?",
    correct: "Ve sladké vodě tůní a rybníků",
    distractors: [
      { value: "Ve slané vodě moří a oceánů", why: "V moři žijí třeba chaluhy. Šroubatka je sladkovodní řasa." },
      { value: "Na suchých kamenech ve skalách", why: "Šroubatka potřebuje stojatou nebo pomalu tekoucí sladkou vodu. Na suchu nežije." },
      { value: "V půdě pod listím v lese", why: "Šroubatka netvoří povlaky v půdě. Její vlákna plavou ve sladké vodě." },
    ],
    hints: [
      "Šroubatka tvoří jemná vlákna, která se volně vznášejí. Jaké prostředí je k tomu potřeba?",
      "Vlákna šroubatky najdeš v létě v tůních a pomalých vodách u nás. Slaná voda patří jiným, mnohem větším řasám.",
    ],
    explanation: "Šroubatka žije ve sladké stojaté nebo pomalu tekoucí vodě, v tůních a rybnících. V moři žijí chaluhy.",
  },
  {
    q: "Proč řasy potřebují ke svému životu světlo?",
    correct: "Protože bez světla neprobíhá fotosyntéza",
    distractors: [
      { value: "Protože rostou jen ve vodě ohřáté sluncem", why: "Řasy žijí i ve studené vodě. Světlo potřebují kvůli energii pro fotosyntézu, ne kvůli teplu." },
      { value: "Protože světlem dýchají místo kyslíku", why: "Světlem se nedýchá. Světlo dává energii pro fotosyntézu." },
      { value: "Protože ze světla berou vodu pro buňky", why: "Vodu řasy přijímají z okolí celým povrchem. Světlo jim dává energii pro fotosyntézu." },
    ],
    hints: [
      "Vzpomeň si, jak si řasy získávají živiny.",
      "Řasy si cukr vyrábějí samy v chloroplastech a potřebují k tomu energii. Odkud ji berou, když nežijí z hotové potravy?",
    ],
    explanation: "Řasy si živiny vyrábějí fotosyntézou v chloroplastech a energii k ní berou ze světla. Bez světla by neměly potravu. Voda ani teplo světlo nenahradí.",
  },
  {
    q: "Jak vypadá tělo žabího vlasu?",
    correct: "Větvená zelená vlákna",
    distractors: [
      { value: "Nevětvené vlákno se šroubovitým chloroplastem", why: "To je popis šroubatky. Vlákna žabího vlasu se větví." },
      { value: "Jediná kulovitá buňka", why: "Jednobuněčná je zelenivka. Žabí vlas tvoří vlákna z mnoha buněk." },
      { value: "Velká hnědá mořská stélka", why: "To je popis chaluhy. Žabí vlas je zelená sladkovodní řasa." },
    ],
    hints: [
      "Jméno žabího vlasu napovídá, jak vypadá ve vodě. Rozhodni, jestli jde o buňku, vlákno, nebo velkou stélku.",
      "Žabí vlas tvoří ve sladké vodě zelené chomáče. Na rozdíl od šroubatky z jeho vláken vyrůstají postranní výběžky.",
    ],
    explanation: "Žabí vlas tvoří větvená zelená vlákna, která ve vodě vypadají jako chomáč vlasů. Nevětvené vlákno má šroubatka, jednobuněčná je zelenivka a hnědou mořskou stélku má chaluha.",
  },
  {
    q: "Co řasy potřebují k fotosyntéze?",
    correct: "Světlo, vodu a oxid uhličitý",
    distractors: [
      { value: "Tmu, vodu a kyslík", why: `Ve tmě fotosyntéza neprobíhá. ${FOTOSYNTEZA}` },
      { value: "Světlo, cukr a kyslík", why: `Cukr při fotosyntéze vzniká, není potřeba ho dodat. ${FOTOSYNTEZA}` },
      { value: "Půdu, kořeny a hnojivo", why: `Řasy kořeny nemají a nerostou v půdě. ${BEZ_KORENU}` },
    ],
    hints: [
      "Fotosyntéza vyrábí živiny pomocí energie odněkud zvenčí. Odkud ta energie přichází?",
      "Z jednoho plynu, který vydechujeme, a z vody si řasa vyrobí cukr. Energii k tomu získá, jen když je dost jasno.",
    ],
    explanation: "K fotosyntéze řasy potřebují světlo, vodu a oxid uhličitý. Vzniká při ní cukr a kyslík. Ve tmě fotosyntéza neprobíhá a kořeny řasy nemají.",
  },
  {
    q: "Do které skupiny řas patří šroubatka a žabí vlas?",
    correct: "Zelené řasy",
    distractors: [
      { value: "Hnědé řasy", why: "K hnědým řasám patří mořské chaluhy. Šroubatka i žabí vlas jsou zelené." },
      { value: "Červené řasy", why: "Červené řasy (ruduchy) žijí hlavně v moři. Šroubatka i žabí vlas jsou zelené." },
      { value: "Sinice", why: `Sinice nejsou řasy. ${SINICE}` },
    ],
    hints: [
      "Oba organismy tvoří jemná vlákna ve sladkých tůních a rybnících. Které skupiny naopak žijí hlavně v moři?",
      "Velké mořské druhy tvoří dvě skupiny, chaluhy a ruduchy. Sinice sem vůbec nepatří, protože nemají jádro. Která skupina zbude pro drobné sladkovodní druhy?",
    ],
    explanation: "Šroubatka i žabí vlas jsou zelené řasy: chlorofyl u nich nic nezakrývá. Chaluhy jsou hnědé řasy, ruduchy červené a sinice mezi řasy nepatří.",
  },
  {
    q: "Jak velká může být stélka chaluhy?",
    correct: "Dlouhá i několik metrů",
    distractors: [
      { value: "Nanejvýš jako špendlíková hlavička", why: "Tak drobné jsou jednobuněčné řasy. Chaluhy patří k největším řasám." },
      { value: "Nanejvýš jako lidský prst", why: "Tak malé bývají spíš chomáče sladkovodních řas. Chaluhy dorůstají délky i několika metrů." },
      { value: "Asi jako dlaň, podobně jako list stromu", why: "Stélka chaluhy není list stromu a bývá mnohem větší. Může měřit i několik metrů." },
    ],
    hints: [
      "Chaluhy patří k největším řasám vůbec. Která možnost tomu odpovídá?",
      "V moři tvoří chaluhy celé podmořské porosty, kterými plavou ryby. Porovnej to s velikostí jednobuněčných řas.",
    ],
    explanation: "Chaluhy jsou největší řasy: jejich stélka může být dlouhá i několik metrů a tvoří podmořské porosty. Drobné jako špendlíková hlavička jsou jednobuněčné řasy.",
  },
];

// ── L2 — POUŽITÍ: znak → zástupce, prostředí, význam; srovnání ─────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Který zástupce řas tvoří dlouhá nevětvená vlákna a v každé buňce má zelený pásek zatočený dokola?",
    correct: "Šroubatka",
    distractors: [ZELENIVKA, ZABI_VLAS, CHALUHA],
    hints: [
      "Znak „vlákno“ vyřadí dvě možnosti. Mezi vláknitými řasami pak rozhodne, jestli má vlákno odbočky.",
      "Jednobuněčná řasa vlákno netvoří a mořská řasa je hnědá a velká. Ze dvou sladkovodních vláknitých řas se jedna větví, druhá ne.",
    ],
    explanation: "Šroubatka tvoří nevětvená vlákna a v každé buňce má chloroplast (zelený pásek) stočený do šroubovice, podle kterého dostala jméno. Žabí vlas se větví, zelenivka je jednobuněčná a chaluha je velká mořská řasa.",
  },
  {
    q: "Která řasa je jednobuněčná a pouhým okem ji jako jednotlivce neuvidíš?",
    correct: "Zelenivka",
    distractors: [SROUBATKA, ZABI_VLAS, CHALUHA],
    hints: [
      "Tři z možností tvoří vlákna nebo velkou stélku. Která zbude?",
      "Vlákno i stélka se skládají z mnoha buněk. Hledáš řasu, jejíž celé tělo je jediná drobná zelená buňka s jádrem.",
    ],
    explanation: "Zelenivka je jednobuněčná zelená řasa, jednotlivě ji uvidíš jen mikroskopem. Šroubatka a žabí vlas tvoří vlákna, chaluha velkou stélku.",
  },
  {
    q: "Který zástupce řas tvoří ve sladké vodě zelené chomáče z vláken, která se větví?",
    correct: "Žabí vlas",
    distractors: [ZELENIVKA, SROUBATKA, CHALUHA],
    hints: [
      "Vyřaď řasu jednobuněčnou a řasu mořskou. Mezi vláknitými rozhoduje větvení.",
      "Obě zelené vláknité řasy žijí ve sladké vodě. Jedna má chloroplast stočený do šroubovice a vlákno bez odboček, druhá tvoří větvené chomáče.",
    ],
    explanation: "Větvená zelená vlákna ve sladké vodě tvoří žabí vlas. Šroubatka má vlákna nevětvená, zelenivka je jednobuněčná a chaluha žije v moři.",
  },
  {
    q: "Která z uvedených řas žije v moři a má hnědou stélku?",
    correct: "Chaluha",
    distractors: [ZELENIVKA, SROUBATKA, ZABI_VLAS],
    hints: [
      "Tři z možností jsou zelené řasy ze sladké vody. Která zbude?",
      "Zelenivka, šroubatka i žabí vlas jsou zelené a žijí u nás v tůních a rybnících. Hledáš velkou řasu ze slané vody, která se drží kamenů.",
    ],
    explanation: "Hnědou stélku má chaluha, velká mořská řasa. Zelenivka, šroubatka i žabí vlas jsou zelené sladkovodní řasy.",
  },
  {
    q: "Čím se liší buňka řasy od buňky sinice?",
    correct: "Buňka řasy má jádro, sinice ne",
    distractors: [
      { value: "Buňka sinice má jádro, řasy ne", why: `Je to naopak. ${SINICE}` },
      { value: "Buňka řasy nemá stěnu, sinice ano", why: "Buněčnou stěnu mají řasy i sinice. Rozdíl je v jádře." },
      { value: "Buňka řasy nemá dědičnou informaci", why: `Dědičnou informaci mají obě. ${SINICE}` },
    ],
    hints: [
      "Sinice stojí blízko bakteriím. Vzpomeň si, co bakteriální buňce chybí.",
      "Obě buňky jsou zelené a dělají fotosyntézu, obě mají stěnu i dědičnou informaci. Liší se tím, jestli je dědičná informace uzavřená v samostatném útvaru.",
    ],
    explanation: "Řasy mají buňky s jádrem, sinice jádro nemají a jejich dědičná informace je volně v buňce. Proto sinice mezi řasy nepatří, i když jsou také zelené a dělají fotosyntézu.",
  },
  {
    q: "Proč jsou drobné řasy důležité pro ryby v rybníce?",
    correct: "Živí drobné živočichy, kterými se živí ryby",
    distractors: [
      { value: "Zakalují vodu, a proto rybám jen škodí", why: "Řasy nejsou jen škodlivé. Jsou potravou drobných živočichů a ti jsou potravou ryb." },
      { value: "Vydechují oxid uhličitý, který ryby dýchají", why: `Ryby dýchají kyslík. ${FOTOSYNTEZA}` },
      { value: "Rozkládají mrtvé ryby jako houby", why: "Rozklad obstarávají hlavně bakterie a houby. Řasy si živiny vyrábějí fotosyntézou." },
    ],
    hints: [
      "Zamysli se, kdo v rybníce stojí na začátku potravního řetězce.",
      "Sestav potravní řetězec rybníka: kdo si potravu vyrobí sám a kdo ji musí sníst?",
    ],
    explanation: "Drobné řasy stojí na začátku potravního řetězce ve vodě: živí se jimi drobní živočichové a těmi ryby. Navíc při fotosyntéze uvolňují kyslík, který ryby dýchají.",
  },
  {
    q: "K čemu člověk využívá chaluhy?",
    correct: "Jako potravu a hnojivo",
    distractors: [
      { value: "Jako dřevo na stavby", why: "Chaluhy nemají dřevo, jejich stélka je měkká a pružná." },
      { value: "Jako palivo místo uhlí", why: "Jako palivo se chaluhy běžně nepoužívají. Lidé je jedí a hnojí jimi pole." },
      { value: "Jako semena k setí", why: "Řasy semena netvoří. Chaluhy se jedí a slouží jako hnojivo." },
    ],
    hints: [
      "Stélka chaluh je měkká a obsahuje mnoho živin. Komu se takové živiny hodí?",
      "V přímořských zemích se chaluhy přidávají do jídla a zemědělci je sbírají na břehu a zapracovávají do půdy, aby lépe rostly plodiny.",
    ],
    explanation: "Chaluhy obsahují mnoho živin, proto je lidé jedí a používají jako hnojivo na pole. Dřevo ani semena nemají.",
  },
  {
    q: "Čím se chaluha drží na skalách, když nemá kořeny?",
    correct: "Příchytnými útvary",
    distractors: [
      { value: "Tenkými kořínky", why: `Kořínky chaluha nemá. ${BEZ_KORENU}` },
      { value: "Podzemním oddenkem", why: "Oddenek je podzemní stonek vyšších rostlin. Chaluha stonek nemá." },
      { value: "Ostrými trny", why: "Trny chaluha nemá. Ke kamenům ji drží příchytné útvary (rhizoidy nebo terčík)." },
    ],
    hints: [
      "Chaluha nemá kořen, stonek ani list. Jaká část stélky ji tedy drží na kameni?",
      "Spodní část stélky chaluhy tvoří útvar, který se jen pevně drží skály, ale vodu z ní nesaje. Jmenuje se podle toho, co dělá.",
    ],
    explanation: "Chaluha se drží skal příchytnými útvary (rhizoidy nebo příchytným terčíkem). Nejsou to kořeny: stélku jen drží a vodu ani živiny nesají. Ty chaluha přijímá celým povrchem.",
  },
  {
    q: "Ve které vrstvě rybníka je řas nejvíc?",
    correct: "V horní vrstvě vody, kam proniká světlo",
    distractors: [
      { value: "V bahně u dna, kde je nejvíc živin", why: "U dna je tma a řasy potřebují ke své výživě světlo." },
      { value: "V hluboké vodě, kde je největší chlad", why: "Chlad řasám nepomáhá. Potřebují světlo, a to je u hladiny." },
      { value: "V tmavých místech pod kořeny stromů", why: "Ve tmě fotosyntéza neprobíhá, řasy potřebují světlo." },
    ],
    hints: [
      "Řasy si vyrábějí živiny fotosyntézou. Co k tomu nutně potřebují?",
      "Čím hlouběji ve vodě, tím je tma větší. Hledej místo, kde mají řasy pro výživu nejlepší podmínky, ne kde je nejvíc živin nebo chladu.",
    ],
    explanation: "Řasy potřebují k fotosyntéze světlo, a to proniká jen do horní vrstvy vody. U dna je tma, tam fotosyntéza neprobíhá.",
  },
  {
    q: "Čím se řasy liší od hub?",
    correct: "Řasy mají chloroplasty, houby ne",
    distractors: [
      { value: "Houby mají chloroplasty, řasy ne", why: `Je to naopak. ${HOUBY}` },
      { value: "Řasy nemají jádro, houby ano", why: "Jádro mají řasy i houby. Bez jádra jsou sinice." },
      { value: "Řasy mají kořeny, houby podhoubí", why: `Kořeny řasy nemají. ${BEZ_KORENU}` },
    ],
    hints: [
      "Porovnej výživu: kdo si živiny vyrobí sám a kdo je bere hotové?",
      "Houba roste i ve tmě a živí se rozkladem nebo soužitím. Řasa bez světla nevydrží. Hledej část buňky, která tento rozdíl způsobuje.",
    ],
    explanation: "Řasy mají chloroplasty a vyrábějí si živiny fotosyntézou. Houby chloroplasty nemají a živí se hotovými látkami. Jádro mají obě skupiny, kořeny žádná.",
  },
  {
    q: "Kterou řasu z nabídky lidé sklízejí jako hnojivo a potravu?",
    correct: "Chaluha",
    distractors: [ZELENIVKA, SROUBATKA, ZABI_VLAS],
    hints: [
      "K velkému využití je potřeba řasa, které je hodně a je velká. Která to je?",
      "Jednobuněčnou řasu ani jemná vlákna z tůně nikdo ve velkém nesklízí. Hledáš velkou řasu, kterou moře vyplavuje na břeh.",
    ],
    explanation: "Lidé využívají chaluhy: jsou velké, rostou ve velkém množství v moři a obsahují mnoho živin. Zelenivka, šroubatka a žabí vlas jsou drobné sladkovodní řasy.",
  },
  {
    q: "Jak řasa přijímá vodu a živiny, když nemá kořeny?",
    correct: "Celým povrchem stélky",
    distractors: [
      { value: "Příchytnými útvary ze dna", why: "Příchytné útvary řasu jen drží na kameni, vodu nesají." },
      { value: "Tenkými kořeny v bahně", why: `Kořeny řasy nemají. ${BEZ_KORENU}` },
      { value: "Jen listy nad hladinou", why: "Listy řasy nemají a žijí ponořené ve vodě." },
    ],
    hints: [
      "Řasa je celá ponořená ve vodě. Musí vodu někam vést, nebo ji má všude kolem sebe?",
      "Suchozemská rostlina potřebuje kořeny, protože voda je jen v půdě. Řasu voda obklopuje ze všech stran, a tak ji může přijímat kterákoli buňka stélky.",
    ],
    explanation: "Řasa žije ve vodě a vodu i rozpuštěné živiny přijímá celým povrchem stélky. Kořeny nepotřebuje, příchytné útvary ji jen drží.",
  },
  {
    q: "Který plyn řasy při fotosyntéze z vody odebírají?",
    correct: "Oxid uhličitý",
    distractors: [
      { value: "Kyslík", why: `Kyslík řasy při fotosyntéze naopak uvolňují. ${FOTOSYNTEZA}` },
      { value: "Dusík", why: `Dusík fotosyntéza nepotřebuje. ${FOTOSYNTEZA}` },
      { value: "Vodík", why: `Vodík řasy z vody jako plyn neodebírají. ${FOTOSYNTEZA}` },
    ],
    hints: [
      "Fotosyntéza odebírá plyn, který živočichové vydechují.",
      "Ryby ve vodě dýchají a jeden plyn vydechují. Řasa ho použije k výrobě cukru a místo něj vrací plyn, který ryby potřebují.",
    ],
    explanation: "Při fotosyntéze řasy odebírají z vody oxid uhličitý a uvolňují kyslík. Proto řasy a živočichové ve vodě tvoří rovnováhu.",
  },
  {
    q: "Ve které dvojici žijí obě řasy ve sladké vodě?",
    correct: "Šroubatka a žabí vlas",
    distractors: [
      { value: "Šroubatka a chaluha", why: "Šroubatka ve sladké vodě žije, ale chaluha je mořská řasa." },
      { value: "Žabí vlas a chaluha", why: "Žabí vlas ve sladké vodě žije, ale chaluha je mořská řasa." },
      { value: "Ruducha a chaluha", why: "Ruducha i chaluha jsou mořské řasy. Ve sladké vodě nežije ani jedna." },
    ],
    hints: [
      "U každé dvojice ověř obě řasy zvlášť. Stačí jedna mořská řasa a dvojice neplatí.",
      "Velké hnědé a červené řasy žijí hlavně ve slané vodě. Hledáš dvojici dvou zelených vláknitých řas z tůní.",
    ],
    explanation: "Ve sladké vodě žijí šroubatka i žabí vlas, zelené vláknité řasy. Chaluha (hnědá) a ruducha (červená) jsou mořské řasy, takže dvojice s nimi neplatí.",
  },
  {
    q: "Čím se liší zelené řasy od hnědých?",
    correct: "Hnědé mají barvivo, které zakryje chlorofyl",
    distractors: [
      { value: "Hnědé nemají chlorofyl a fotosyntézu nedělají", why: "Hnědé řasy chlorofyl mají a fotosyntézu dělají. Zelenou barvu jim jen zakrývá hnědé barvivo." },
      { value: "Zelené nemají jádro, zatímco hnědé ano", why: "Jádro mají zelené i hnědé řasy. Bez jádra jsou sinice." },
      { value: "Hnědé mají kořeny, zatímco zelené jen stélku", why: `Ani hnědé řasy kořeny nemají. ${BEZ_KORENU}` },
    ],
    hints: [
      "Obě skupiny dělají fotosyntézu. Jaké barvivo k ní potřebují mít v chloroplastech?",
      "Chaluha má stejné zelené barvivo jako šroubatka, a přesto nevypadá zeleně. Čím to asi je?",
    ],
    explanation: "Zelené i hnědé řasy mají chlorofyl a dělají fotosyntézu. Hnědé řasy mají navíc hnědé barvivo, které zelenou barvu zakryje. Jádro mají obě skupiny a kořeny žádná.",
  },
];

// ── L3 — PŘENOS: popis bez jména, rozhodnutí o tvrzení, znak → funkce ──────
export const POOL_L3: Polozka[] = [
  {
    q: "Co mají společného šroubatka a chaluha?",
    correct: "Obě nemají kořeny a dělají fotosyntézu",
    distractors: [
      { value: "Obě žijí ve sladké vodě tůní a rybníků", why: "Ve sladké vodě žije jen šroubatka. Chaluha je mořská řasa." },
      { value: "Obě tvoří dlouhá nevětvená zelená vlákna", why: "Vlákna tvoří jen šroubatka. Chaluha má velkou hnědou stélku." },
      { value: "Obě jsou hnědé řasy s velkou stélkou", why: "Hnědá a velká je jen chaluha. Šroubatka je drobná zelená řasa." },
    ],
    hints: [
      "U každé možnosti ověř obě řasy zvlášť. Platí tvrzení pro šroubatku i pro chaluhu?",
      "Řasy se liší barvou, velikostí a prostředím. Hledáš znak, který mají všechny řasy bez ohledu na to, jak vypadají a kde žijí.",
    ],
    explanation: "Šroubatka i chaluha jsou řasy: mají stélku bez kořene, stonku a listu a v chloroplastech dělají fotosyntézu. Liší se prostředím (sladká voda × moře), barvou (zelená × hnědá) i tvarem (vlákno × velká stélka).",
  },
  {
    q: "V moři u skal roste hnědá stélka dlouhá přes metr, přichycená ke kameni. Co to je?",
    correct: "Chaluha",
    distractors: [ZELENIVKA, SROUBATKA, ZABI_VLAS],
    hints: [
      "Projdi znaky: barva, velikost a prostředí. Který zástupce odpovídá všem třem?",
      "Zelené řasy z nabídky žijí ve sladké vodě a jsou drobné. Velká hnědá stélka ze slané vody patří jiné skupině.",
    ],
    explanation: "Velká hnědá stélka v moři, přichycená příchytnými útvary ke kameni, je chaluha. Ostatní možnosti jsou drobné zelené sladkovodní řasy.",
  },
  {
    q: "V kapce z louže vidíš pod mikroskopem mnoho samostatných zelených kuliček. Každá má jádro a chloroplast a netvoří s ostatními vlákno. O kterou řasu jde?",
    correct: "Zelenivka",
    distractors: [SROUBATKA, ZABI_VLAS, CHALUHA],
    hints: [
      "Samostatná kulička, která netvoří vlákno, je celý organismus. Z kolika buněk se tedy skládá?",
      "Vlákna tvoří dvě řasy z nabídky, velkou stélku třetí. Hledáš řasu, jejíž tělo tvoří jediná buňka.",
    ],
    explanation: "Samostatné zelené buňky s jádrem a chloroplastem jsou jednobuněčná řasa zelenivka. Šroubatka a žabí vlas tvoří vlákna, chaluha velkou stélku.",
  },
  {
    q: "Spolužák popsal šroubatku takto: zelená řasa ze sladké vody, vlákno se větví, buňky mají jádro. Co je v popisu chybně?",
    correct: "Vlákno šroubatky se nevětví",
    distractors: [
      { value: "Šroubatka nežije ve sladké vodě", why: "Šroubatka ve sladké vodě opravdu žije, v tom má spolužák pravdu." },
      { value: "Buňky šroubatky nemají jádro", why: `Šroubatka je řasa a jádro má. ${SINICE}` },
      { value: "Šroubatka není zelená, ale hnědá", why: "Šroubatka je zelená řasa. Hnědé jsou mořské chaluhy." },
    ],
    hints: [
      "Rozeber popis na jednotlivé znaky a každý ověř zvlášť. Který z nich patří jiné řase?",
      "Dvě zelené vláknité řasy z tůní se od sebe liší. Vzpomeň si, jak vypadá vlákno každé z nich.",
    ],
    explanation: "Šroubatka je zelená sladkovodní řasa s jádrem v buňkách, to platí. Její vlákno se ale nevětví. Větvená vlákna tvoří žabí vlas, takže spolužák popis obou řas spletl.",
  },
  {
    q: "Kamarád tvrdí, že chaluha je mořská rostlina s kořeny a listy. V čem se mýlí?",
    correct: "Chaluha nemá kořeny ani listy, jen stélku",
    distractors: [
      { value: "Chaluha nežije v moři, ale v rybníce", why: "Chaluha opravdu žije v moři, v tom má kamarád pravdu. Mýlí se v kořenech a listech." },
      { value: "Chaluha není řasa, ale mořská houba", why: `Chaluha je řasa, houbou není. ${HOUBY}` },
      { value: "Chaluha má kořeny, ale nemá listy", why: `Chaluha nemá ani kořeny, příchytné útvary ji jen drží. ${BEZ_KORENU}` },
    ],
    hints: [
      "Rozeber tvrzení na části: kde chaluha žije a z čeho se skládá její tělo. Která část neplatí?",
      "Chaluha opravdu žije ve slané vodě. Velká stélka se ale jen podobá rostlině: to, co vypadá jako list, i to, co ji drží na kameni, nejsou orgány.",
    ],
    explanation: "Chaluha je mořská řasa, to platí. Její tělo je ale stélka bez kořene, stonku a listu. Listovité části jsou jen část stélky a příchytné útvary ji drží na kameni, vodu nesají.",
  },
  {
    q: "V uzavřené nádobě s řasami se na několik dní výrazně sníží světlo. Co se stane s tvorbou kyslíku?",
    correct: "Tvorba kyslíku se zpomalí, řasám chybí světlo",
    distractors: [
      { value: "Tvorba kyslíku se zrychlí, řasy ve tmě odpočívají", why: "Při slabším světle fotosyntéza nezrychlí, ale zpomalí se, protože jí chybí energie. Kyslíku proto vzniká méně." },
      { value: "Tvorba kyslíku se nezmění, světlo nepotřebují", why: "Řasy světlo potřebují, bez něj fotosyntéza neprobíhá." },
      { value: "Tvorba kyslíku se nezmění, stačí jim teplo", why: "Teplo světlo nenahradí. Energii pro fotosyntézu dává jen světlo." },
    ],
    hints: [
      "Kyslík vzniká při fotosyntéze. Co fotosyntéza potřebuje jako zdroj energie?",
      "Když ubude to, z čeho fotosyntéza bere energii, nemůže probíhat stejně rychle. Teplo ani odpočinek tu nic nezmění.",
    ],
    explanation: "Kyslík řasy uvolňují při fotosyntéze a ta potřebuje světlo. Když světla ubude, fotosyntéza se zpomalí nebo zastaví, a kyslíku vzniká méně.",
  },
  {
    q: "Organismus má buňky s jádrem a chloroplasty a tělo bez kořene, stonku a listu. Do které skupiny patří?",
    correct: "Řasy",
    distractors: [
      { value: "Sinice", why: SINICE },
      { value: "Houby", why: HOUBY },
      { value: "Kapradiny", why: "Kapradiny mají kořeny, stonek i listy. Tělo bez těchto orgánů mají nižší rostliny." },
    ],
    hints: [
      "Každý znak vyřadí jednu možnost. Který znak chybí sinicím, který houbám a který kapradinám?",
      "Buňka s jádrem vyřadí organismy blízké bakteriím, zelená tělíska vyřadí organismy bez fotosyntézy a tělo bez orgánů vyřadí vyšší rostliny.",
    ],
    explanation: "Jádro, chloroplasty a stélku bez kořene, stonku a listu mají řasy. Sinice nemají jádro, houby nemají chloroplasty a kapradiny mají kořen, stonek i listy.",
  },
  {
    q: "Proč v zatopené jeskyni nenajdeš žádné řasy, i když je tam dost vody?",
    correct: "Protože bez světla nemohou dělat fotosyntézu",
    distractors: [
      { value: "Protože voda v jeskyni je na ně příliš studená", why: "Řasy žijí i ve studené vodě, třeba v horských potocích. V jeskyni jim chybí světlo." },
      { value: "Protože v jeskynní vodě nejsou žádné živiny", why: "Rozpuštěné látky jsou i ve vodě v jeskyni. Řasám tam chybí světlo pro fotosyntézu." },
      { value: "Protože tam nemají půdu pro své kořeny", why: `Řasy půdu ani kořeny nepotřebují. ${BEZ_KORENU}` },
    ],
    hints: [
      "Vzpomeň si, co řasy potřebují k výrobě potravy. Co z toho v jeskyni chybí?",
      "Voda i rozpuštěné látky v jeskyni jsou. Porovnej jeskyni s hladinou rybníka: čím se místo hluboko pod zemí liší?",
    ],
    explanation: "Řasy si potravu vyrábějí fotosyntézou a energii k ní berou ze světla. V jeskyni je tma, takže tam řasy nepřežijí, i když mají vodu a živiny. Chlad jim nevadí a kořeny nemají.",
  },
  {
    q: "Bouře odtrhla chaluhu od skály i s jejím příchytným útvarem. Co tím chaluha ztratila?",
    correct: "Jen oporu na místě, vodu dál přijímá povrchem",
    distractors: [
      { value: "Přívod vody, který jí sál příchytný útvar", why: "Příchytný útvar vodu nesaje, jen drží stélku. Vodu a živiny chaluha přijímá celým povrchem." },
      { value: "Kořeny, kterými brala živiny z mořského dna", why: `Chaluha kořeny nemá. ${BEZ_KORENU}` },
      { value: "Jediné místo, kde probíhala fotosyntéza", why: "Fotosyntéza probíhá hlavně v listovitých částech stélky, a ty chaluze zůstaly." },
    ],
    hints: [
      "Kořeny rostliny na souši ji drží a sají vodu. Který z těch dvou úkolů plnil příchytný útvar chaluhy?",
      "Chaluhu ze všech stran obklopuje mořská voda s rozpuštěnými látkami. Potřebuje k jejich přijímání nějaký zvláštní orgán?",
    ],
    explanation: "Příchytný útvar chaluhu jen drží na skále, vodu ani živiny nesaje. Ty chaluha přijímá celým povrchem stélky, takže po utržení nevyschne, jen ji vlny unášejí. Kořeny ani listy nemá.",
  },
  {
    q: "Ve vodě rybníka žije mnoho drobných zelených řas. Spolužák tvrdí, že řasy jsou pro rybník jen škodlivé. Co je pravda?",
    correct: "Řasy jsou potravou drobných živočichů, kterými se živí ryby",
    distractors: [
      { value: "Řasy vodu jen zakalují a pro rybník nic dobrého nedělají", why: "Řasy vyrábějí kyslík a jsou na začátku potravního řetězce ve vodě." },
      { value: "Řasy rybám jen odebírají kyslík a samy žádný nevyrábějí", why: "Řasy kyslík také dýchají, ale na světle ho fotosyntézou vyrobí víc, než spotřebují." },
      { value: "Řasy jsou ve skutečnosti houby, které vodu jen rozkládají", why: `Řasy nejsou houby. ${HOUBY}` },
    ],
    hints: [
      "Zamysli se, kdo v rybníce řasy jí a kdo jí ty, kdo je jedli.",
      "Zakalená voda nevypadá hezky, ale bez drobných organismů, které si vyrobí potravu ze světla, by v rybníce neměli co jíst ani vodní blešky, ani ryby.",
    ],
    explanation: "Řasy stojí na začátku potravního řetězce ve vodě: jedí je drobní živočichové a ty ryby. Navíc uvolňují kyslík. Tvrzení, že řasy jen škodí, je proto chybné.",
  },
  {
    q: "Na mořském pobřeží leží po bouři hromady hnědých stélek. Proč je zemědělci zapracovávají do půdy?",
    correct: "Protože se v půdě rozloží a uvolní živiny",
    distractors: [
      { value: "Protože z nich v půdě vyrostou nové řasy", why: "Chaluhy potřebují mořskou vodu a světlo. Zahrabané v poli nerostou, ale odumřou." },
      { value: "Protože jejich kořeny v poli zpevní půdu", why: `Chaluhy kořeny nemají. ${BEZ_KORENU}` },
      { value: "Protože v půdě vyrábějí kyslík pro plodiny", why: "Zahrabaná stélka je ve tmě a fotosyntézu nedělá. Odumře a rozloží se." },
    ],
    hints: [
      "Nejdřív urči, co jsou ty stélky zač. Pak zvaž, co se s nimi v zemi stane.",
      "Zahrabaná stélka je ve tmě a mimo slanou vodu. Může v poli dál žít, nebo se s ní stane něco jiného?",
    ],
    explanation: "Hnědé stélky na břehu jsou chaluhy. V půdě odumřou a rozloží se a živiny z nich pak berou plodiny. Mimo moře a ve tmě chaluhy nerostou a kořeny nemají.",
  },
  {
    q: "Ve vzorku z potoka najdeš zelené vlákno. Podle čeho nejlépe rozlišíš, jestli jde o šroubatku, nebo o žabí vlas?",
    correct: "Podle toho, jestli se vlákno větví",
    distractors: [
      { value: "Podle toho, jestli má buňka jádro", why: "Jádro mají obě řasy. Tímto znakem je nerozlišíš." },
      { value: "Podle toho, jestli žije ve sladké vodě", why: "Ve sladké vodě žijí obě. Tímto znakem je nerozlišíš." },
      { value: "Podle toho, jestli dělá fotosyntézu", why: "Fotosyntézu dělají obě. Tímto znakem je nerozlišíš." },
    ],
    hints: [
      "Dobrý rozlišovací znak má jedna řasa a druhá ne. Který znak mají obě stejný?",
      "Každou možnost vyzkoušej: platí ten znak pro jednu řasu a pro druhou ne?",
    ],
    explanation: "Šroubatka i žabí vlas mají jádro, dělají fotosyntézu a žijí ve sladké vodě. Rozliší je tvar: vlákno žabího vlasu se větví, vlákno šroubatky ne (a má chloroplast stočený do šroubovice).",
  },
  {
    q: "Pod mikroskopem vidíš buňku bez jádra, dědičná informace je volně v buňce, a přesto je zelená a dělá fotosyntézu. Co to je?",
    correct: "Sinice",
    distractors: [
      { value: "Zelenivka", why: "Zelenivka je řasa a její buňka má jádro." },
      { value: "Kvasinka", why: "Kvasinka je houba: má jádro a fotosyntézu nedělá." },
      { value: "Trepka", why: "Trepka je prvok s jádrem a fotosyntézu nedělá." },
    ],
    hints: [
      "Zeptej se, jestli má buňka jádro. Který organismus z nabídky ho nemá?",
      "Řasy, houby i prvoci mají buňky s jádrem. Zelené organismy bez jádra stojí blízko bakteriím a tvoří povlaky ve vodě.",
    ],
    explanation: "Buňka bez jádra, která dělá fotosyntézu, patří sinici. Zelenivka je řasa s jádrem, kvasinka a trepka mají jádro a fotosyntézu nedělají.",
  },
  {
    q: "Za slunečného dne se kolem zelených vláken v tůni tvoří drobné bublinky. Který plyn v nich nejspíš je?",
    correct: "Kyslík z fotosyntézy",
    distractors: [
      { value: "Oxid uhličitý z fotosyntézy", why: `Oxid uhličitý fotosyntéza spotřebovává. ${FOTOSYNTEZA}` },
      { value: "Dusík, který vlákna vyrábějí", why: `Dusík řasy nevyrábějí. ${FOTOSYNTEZA}` },
      { value: "Metan, který vlákna vyrábějí", why: `Metan vzniká při hnití v bahně, zelená vlákna ho nevyrábějí. ${FOTOSYNTEZA}` },
    ],
    hints: [
      "Zelená vlákna jsou řasy a na slunci dělají fotosyntézu. Co při ní vzniká jako plyn?",
      "Fotosyntéza jeden plyn spotřebuje a jiný uvolní. Bublinky tvoří ten uvolněný, který dýchají ryby.",
    ],
    explanation: "Zelená vlákna jsou řasy. Na slunci dělají fotosyntézu a uvolňují kyslík, který tvoří bublinky. Oxid uhličitý fotosyntéza spotřebovává.",
  },
  {
    q: "Kamarádka našla v tůni zelený sliz a tvrdí, že je to plíseň, tedy houba. Pod mikroskopem jsou v buňkách chloroplasty. Co z toho plyne?",
    correct: "Jde o řasu, protože houby chloroplasty nemají",
    distractors: [
      { value: "Jde o houbu, protože sliz je typický pro plísně", why: `Vzhled nerozhoduje. ${HOUBY}` },
      { value: "Jde o sinici, protože sinice mají chloroplasty", why: "Sinice chloroplasty nemají a nemají ani jádro. Buňky s chloroplasty patří řasám." },
      { value: "Nejde rozhodnout, chloroplasty mají řasy i houby", why: `Chloroplasty rozhodují, protože je mají jen řasy. ${HOUBY}` },
    ],
    hints: [
      "Rozhodni podle znaku v buňce, ne podle toho, jak sliz vypadá.",
      "Chloroplasty znamenají fotosyntézu. Zeptej se u každé skupiny v nabídce, jestli si umí vyrobit potravu ze světla.",
    ],
    explanation: "Z nabízených skupin mají chloroplasty jen řasy. Houby je nemají a sinice také ne. Zelený sliz s chloroplasty v buňkách jsou tedy řasy, ne plíseň.",
  },
  {
    q: "V rybníce vymřely všechny drobné řasy. Co se nejspíš stane s drobnými živočichy a rybami?",
    correct: "Ubude jim potravy a začnou ubývat",
    distractors: [
      { value: "Nic se nestane, řasy nikdo nejí", why: "Řasy jsou potravou drobných živočichů a ti ryb." },
      { value: "Přibude jich, protože voda bude čistší", why: "Čistší voda jim potravu nedá. Řasy stojí na začátku potravního řetězce." },
      { value: "Přibude jim kyslíku, řasy ho spotřebovávaly", why: "Řasy kyslík také dýchají, ale fotosyntézou ho na světle vyrobí víc, než spotřebují. Po jejich úhynu by kyslíku ubylo, navíc ho spotřebuje rozklad odumřelých řas." },
    ],
    hints: [
      "Sestav potravní řetězec rybníka od začátku. Co se stane, když zmizí první článek?",
      "Drobní živočichové spásají řasy a ryby loví drobné živočichy. Navíc řasy dodávají do vody plyn, který všichni dýchají.",
    ],
    explanation: "Řasy stojí na začátku potravního řetězce: jedí je drobní živočichové a ty ryby. Bez řas by ubylo potravy i kyslíku, a živočichů by ubývalo.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  let i = 0; // rotace se nastavuje při každém volání, mezi voláními žádný stav
  const genLx = () => vytvor(pool[i++ % pool.length]);
  return ruzneUlohy(() => losUlohy(genLx), pool.length, pool.length);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const RASY_STAVBA_ZASTUPCI_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-pri-rasy-stavba-zastupci-vyznam-6",
    rvpNodeId: "g6-prirodopis-biologie-rostlin-nizsi-rostliny-rasy-stavba-zastupci-vyznam",
    displayName: "Řasy: stavba, zástupci, význam",
    title: "Řasy - stavba, zástupci, význam",
    studentTitle: "Řasy",
    subject: "prirodopis",
    category: "Biologie rostlin",
    topic: "Nižší rostliny",
    briefDescription: "Poznáš řasy podle stavby, znáš zástupce a víš, k čemu jsou.",
    keywords: [
      "řasy", "řasa", "nižší rostliny", "stélka", "chloroplast", "fotosyntéza", "kyslík",
      "zelenivka", "šroubatka", "žabí vlas", "chaluhy", "příchytné útvary",
      "zelené řasy", "hnědé řasy", "potravní řetězec", "sinice",
    ],
    goals: [
      "Popsat stavbu řasy: stélka bez kořene, stonku a listu, buňka s jádrem a chloroplasty.",
      "Rozlišit zelenivku, šroubatku, žabí vlas a chaluhy podle stavby a prostředí.",
      "Vysvětlit význam řas pro vodu (kyslík, potravní řetězec) a pro člověka.",
    ],
    boundaries: [
      "Jen fakta z běžných učebnic 6. ročníku, bez rozmnožování a systému řas.",
      "Agar, vodní květ a stanoviště zelenivky nejsou klíčem (učebnice se v nich liší).",
      "Latinské názvy se nepoužívají.",
      "Drží se školní dělení: řasy (i hnědé chaluhy) jako nižší rostliny, bez současné systematiky.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Řasa má stélku bez kořene, stonku a listu a buňky s jádrem a chloroplasty. Zástupce poznáš podle tvaru: jedna buňka, nevětvené vlákno, větvené vlákno, nebo velká mořská stélka.",
      steps: [
        "Urči, jestli má organismus jednu buňku, vlákno, nebo velkou stélku.",
        "U vlákna se podívej, jestli se větví a jaký tvar má chloroplast.",
        "Podle prostředí (sladká voda, nebo moře) a barvy potvrď zástupce.",
      ],
      commonMistake: "Myslet si, že velká chaluha má kořeny a listy, nebo zaměnit řasy se sinicemi.",
      example: "Nevětvené zelené vlákno s chloroplastem stočeným do šroubovice je šroubatka ze sladké vody.",
    },
  },
];
