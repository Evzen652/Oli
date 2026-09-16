/**
 * Přírodopis 6. ročník — Houby: stavba, výživa, význam (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3). Každá položka má
 * vlastní znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba šesťáka):
 *  • houba je rostlina — vyrábí si živiny ze světla, má chlorofyl;
 *  • podhoubí = kořeny, plodnice = celá houba, po utržení houba zanikne;
 *  • houby se rozmnožují semeny nebo pylem;
 *  • záměna typů výživy (rozkladač × cizopasník × soužití), nerozlišuje se
 *    živý a mrtvý hostitel;
 *  • houby a plísně jsou jen škodlivé; plesnivé jídlo stačí seškrábnout.
 *
 *  • L1 — rozpoznání pojmu a znaku (popis → pojem).
 *  • L2 — použití na konkrétní situaci: rozkladač, cizopasník, soužití,
 *    význam, stavba. Banka je řazená střídavě po kontextech, aby žádné
 *    sezení nesklouzlo k jedinému rozhodnutí „živé, nebo mrtvé“.
 *  • L3 — přenos: neznámý případ, znak ↔ funkce, důsledek.
 *
 * Mimo téma: určování jedlých a jedovatých hub (sousední podtéma).
 * Odborné názvy (saprofyt, parazit) jen v závorce, nikdy jako klíč.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const NENI_ROSTLINA =
  "Houby nemají chlorofyl, proto fotosyntézu nedělají. Živiny přijímají hotové z okolí, třeba z mrtvého dřeva nebo z kořenů stromu.";
const NEMA_KORENY =
  "Kořeny mají rostliny. Houba má v půdě podhoubí z jemných vláken, je to její hlavní a trvalá část.";
const NEMA_SEMENA =
  "Semena mají semenné rostliny. Houby tvoří drobné výtrusy v rourkách nebo lupenech a vítr je roznáší daleko.";

// ── L1 — ROZPOZNÁNÍ POJMU A ZNAKU ───────────────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Jak se jmenuje spleť jemných vláken, která roste v půdě a tvoří hlavní část těla houby?",
    correct: "Podhoubí",
    distractors: [
      { value: "Kořeny", why: NEMA_KORENY },
      { value: "Plodnice", why: "Plodnice roste nad zemí a tvoří výtrusy. Vlákna v půdě jsou jiná část houby." },
      { value: "Výtrusy", why: "Výtrusy jsou drobná tělíska, kterými se houba rozmnožuje. Spleť vláken to není." },
    ],
    hints: [
      "Mysli na to, co zůstane v zemi, když houbu nad zemí utrhneš.",
      "Rostliny mají v zemi kořeny, houby ne. Plodnice nad zemí a výtrusy to také nejsou. Hledej název pro celé skryté tělo houby.",
    ],
    explanation: "Tělo houby tvoří jemná vlákna. Jejich spleť v půdě nebo ve dřevě se jmenuje podhoubí. Je to hlavní a trvalá část houby, plodnice z něj jen občas vyroste.",
  },
  {
    q: "Jak se jmenuje část houby, kterou vidíme nad zemí a sbíráme ji do košíku?",
    correct: "Plodnice",
    distractors: [
      { value: "Podhoubí", why: "Podhoubí je spleť vláken skrytá v půdě. Do košíku ho nesbíráme." },
      { value: "Stonek", why: "Stonek mají rostliny. Houba nad zemí tvoří jinou část s kloboukem a třeněm." },
      { value: "Výtrus", why: "Výtrus je tak malý, že ho okem nevidíme. Nad zemí vidíme část, která výtrusy tvoří." },
    ],
    hints: [
      "Mysli na to, co z houby vidíš nad zemí a proč to houba vůbec vytváří.",
      "Hledej název pro tu část, kterou houba tvoří jen občas a jen kvůli rozmnožování. Vlákna v půdě to nejsou.",
    ],
    explanation: "Nad zemí vidíme plodnici. Je to jen část houby, která tvoří a uvolňuje výtrusy. Hlavní tělo, podhoubí, zůstává skryté v půdě.",
  },
  {
    q: "Čím se houby rozmnožují?",
    correct: "Výtrusy",
    distractors: [
      { value: "Semeny", why: NEMA_SEMENA },
      { value: "Pylem", why: "Pyl tvoří kvetoucí rostliny při opylení. Houby nekvetou, rozmnožují se drobnými výtrusy." },
      { value: "Hlízami", why: "Hlízy má třeba brambor, tedy rostlina. Houby se šíří drobnými tělísky, která roznáší vítr." },
    ],
    hints: [
      "Houby nekvetou. Vzpomeň si, co vítr roznáší z plodnice jako jemný prášek.",
      "Semena, pyl i hlízy patří rostlinám. Houba tvoří drobná tělíska, tak malá, že je jednotlivě nevidíš; když poklepeš na zralou plodnici, vyletí z ní jako prach.",
    ],
    explanation: "Houby se rozmnožují výtrusy. Jsou drobné a lehké, tvoří se v plodnici a vítr je roznáší daleko. Semena a pyl mají rostliny.",
  },
  {
    q: "Kde se u hřibu tvoří výtrusy?",
    correct: "V rourkách na spodní straně klobouku",
    distractors: [
      { value: "V lupenech na spodní straně klobouku", why: "Lupeny mají třeba muchomůrky a žampiony. Hřib má pod kloboukem houbovitou vrstvu z drobných trubiček." },
      { value: "V semenících uvnitř třeně", why: `Semeník patří květu rostliny. ${NEMA_SEMENA}` },
      { value: "Ve vláknech podhoubí v půdě", why: "Podhoubí houbu živí, ale výtrusy vznikají nad zemí v plodnici, aby je mohl roznést vítr." },
    ],
    hints: [
      "Otoč si v duchu klobouk hřibu. Jak vypadá jeho spodní strana: jako plátky, nebo jako houbička?",
      "Spodní strana klobouku hřibu připomíná mycí houbu: je z mnoha drobných trubiček vedle sebe. Lupeny jako tenké plátky mají jiné houby.",
    ],
    explanation: "Hřiby mají na spodní straně klobouku rourky, drobné trubičky vedle sebe. V nich se tvoří výtrusy. Lupeny mají houby lupenaté, třeba muchomůrky.",
  },
  {
    q: "Kde se tvoří výtrusy u muchomůrky nebo žampionu?",
    correct: "V lupenech na spodní straně klobouku",
    distractors: [
      { value: "V rourkách na spodní straně klobouku", why: "Rourky mají hřiby. Muchomůrka i žampion mají pod kloboukem tenké plátky." },
      { value: "V drobných semenech na klobouku", why: NEMA_SEMENA },
      { value: "V kořenech hluboko pod zemí", why: NEMA_KORENY },
    ],
    hints: [
      "Představ si spodní stranu klobouku žampionu z obchodu. Co tam vidíš?",
      "Pod kloboukem žampionu jsou těsně vedle sebe tenké plátky, které se paprsčitě sbíhají k třeni. Trubičky jako u hřibu tam nenajdeš.",
    ],
    explanation: "Muchomůrky a žampiony jsou houby lupenaté: pod kloboukem mají tenké plátky, lupeny, a v nich se tvoří výtrusy. Rourky mají hřiby.",
  },
  {
    q: "Proč houby nepatří mezi rostliny?",
    correct: "Protože nemají chlorofyl a živiny si nevyrábějí",
    distractors: [
      { value: "Protože fotosyntézu dělají v klobouku, ne v listech", why: NENI_ROSTLINA },
      { value: "Protože nerostou ze země, ale jen na stromech", why: "Mnoho hub roste ze země. O zařazení nerozhoduje místo, ale způsob výživy." },
      { value: "Protože jsou mnohem menší než většina rostlin", why: "Velikost nerozhoduje. Podhoubí může zabírat velkou plochu. Rozhoduje, jak se organismus živí." },
    ],
    hints: [
      "Vzpomeň si, co mají rostliny a houby ne.",
      "Rostlina si díky zelenému barvivu vyrobí živiny ze světla, vody a vzduchu. Zeptej se, jestli to houba umí, a vylouč možnosti, které mluví o velikosti nebo o místě.",
    ],
    explanation: "Houby nemají zelené barvivo chlorofyl, a proto si živiny nevyrábějí. Přijímají je hotové z okolí. Tím se od rostlin zásadně liší a tvoří samostatnou říši.",
  },
  {
    q: "Kterou látku obsahují stěny buněk hub?",
    correct: "Chitin",
    distractors: [
      { value: "Celulózu", why: "Celulóza tvoří stěny buněk rostlin. Houby mají v buněčných stěnách jinou látku." },
      { value: "Škrob", why: "Škrob je zásobní látka rostlin, třeba v bramborách. Stěny buněk z něj nejsou." },
      { value: "Chlorofyl", why: "Chlorofyl je zelené barvivo rostlin a houby ho nemají vůbec." },
    ],
    hints: [
      "Stejnou látku najdeš i v krovkách brouků. Rostlinné látky vyluč.",
      "Stěny rostlinných buněk jsou z celulózy, škrob je zásoba a zelené barvivo houby nemají. Houby mají ve stěnách pevnou látku, kterou známe i z krunýřů hmyzu.",
    ],
    explanation: "Buněčné stěny hub obsahují chitin, stejnou pevnou látku, jaká je v krunýřích hmyzu. Rostliny mají ve stěnách celulózu. I tím se houby od rostlin liší.",
  },
  {
    q: "Jak se jmenuje drobná jednobuněčná houba, díky které kyne těsto?",
    correct: "Kvasinka",
    distractors: [
      { value: "Plíseň", why: "Plíseň tvoří vlákna a jídlo kazí. Těsto nakypří jiná, jednobuněčná houba." },
      { value: "Bakterie", why: "Bakterie nejsou houby. Těsto kypří houba, která je v droždí." },
      { value: "Řasa", why: "Řasy žijí hlavně ve vodě a mají chlorofyl. Do těsta se nepřidávají." },
    ],
    hints: [
      "Pekař ji přidává do těsta jako droždí. Je tak malá, že ji okem nevidíš.",
      "Hledáš houbu, která má jen jednu buňku a v těstě uvolňuje plyn. Plíseň je z vláken, bakterie a řasy mezi houby nepatří.",
    ],
    explanation: "Těsto kynou kvasinky. Jsou to jednobuněčné houby, které jsou v droždí. Při kvašení uvolňují plyn a ten těsto nafoukne.",
  },
  {
    q: "Jak se jmenuje houba, která tvoří zelenomodrý povlak na starém chlebu?",
    correct: "Plíseň",
    distractors: [
      { value: "Kvasinka", why: "Kvasinky jsou v droždí a těsto kypří. Chléb nepokrývají chlupatým povlakem." },
      { value: "Lišejník", why: "Lišejník roste na kůře a kamenech a je to soužití houby s řasou. Na chlebu neroste." },
      { value: "Řasa", why: "Řasa není houba a žije hlavně ve vodě. Povlak na chlebu tvoří houbová vlákna." },
    ],
    hints: [
      "O jídle s takovým povlakem říkáme, že je plesnivé.",
      "Povlak na starém chlebu je z jemných houbových vláken. Kvasinky kypří těsto, lišejník roste na kůře a řasa ve vodě, takže je vyluč.",
    ],
    explanation: "Zelenomodrý povlak na chlebu tvoří plíseň. Je to houba z jemných vláken, která prorůstají potravinou. Plesnivé jídlo se proto vyhazuje celé.",
  },
  {
    q: "Jak se jmenuje soužití houby s kořeny stromu, ze kterého mají užitek oba?",
    correct: "Mykorhiza",
    distractors: [
      { value: "Cizopasnictví", why: "Cizopasník hostiteli škodí. Tady mají užitek houba i strom." },
      { value: "Rozklad", why: "Rozklad je rozkládání mrtvých zbytků. Soužití probíhá se živými kořeny." },
      { value: "Opylování", why: "Opylování je přenos pylu mezi květy. S houbou a kořeny nesouvisí." },
    ],
    hints: [
      "Hledáš odborné slovo pro vzájemně prospěšný vztah houby a kořenů.",
      "Název vznikl z řeckých slov pro houbu a kořen. Vylouč vztah, ve kterém jeden škodí, i děje, které se živých kořenů netýkají.",
    ],
    explanation: "Soužití houby s kořeny stromu se jmenuje mykorhiza. Houba dává stromu vodu a minerální látky, strom houbě cukry. Užitek z toho mají oba.",
  },
  {
    q: "Jak se nazývá houba, která se živí odumřelými zbytky rostlin a živočichů?",
    correct: "Rozkladač",
    distractors: [
      { value: "Cizopasník", why: "Cizopasník bere živiny živému organismu. Tady jde o mrtvé zbytky." },
      { value: "Výrobce", why: `Výrobci jsou zelené rostliny. ${NENI_ROSTLINA}` },
      { value: "Dravec", why: "Dravec loví živou kořist. Houba, která se živí mrtvými zbytky, nic neloví." },
    ],
    hints: [
      "Mysli na to, co se děje se spadlým listím, když ho houby zpracují.",
      "Mrtvé zbytky houba zpracuje a živiny vrátí do půdy. Cizopasník potřebuje živého hostitele, dravec loví a výrobce má chlorofyl, takže je vyluč.",
    ],
    explanation: "Houba, která se živí odumřelými zbytky, je rozkladač (saprofyt). Rozkládá listí, dřevo i těla živočichů a živiny vrací do půdy.",
  },
  {
    q: "Jak se nazývá houba, která bere živiny živému organismu a škodí mu?",
    correct: "Cizopasník",
    distractors: [
      { value: "Rozkladač", why: "Rozkladač se živí mrtvými zbytky. Tady houba napadá živý organismus." },
      { value: "Výrobce", why: `Výrobci jsou zelené rostliny. ${NENI_ROSTLINA}` },
      { value: "Dravec", why: "Dravec svou kořist loví a zabije rychle. Tahle houba se nehýbe, žije na hostiteli dlouho a pomalu ho oslabuje." },
    ],
    hints: [
      "Hledáš slovo pro toho, kdo žije na jiném živém organismu a na jeho úkor.",
      "Rozkladač se živí mrtvými zbytky, dravec kořist loví a výrobce má chlorofyl. Který název zbývá pro houbu na živém hostiteli?",
    ],
    explanation: "Houba, která bere živiny živému organismu a škodí mu, je cizopasník (parazit). Příkladem je choroš nebo václavka na živých stromech.",
  },
  {
    q: "Kterou látku houby nemají, a proto si nedokážou vyrobit živiny ze světla?",
    correct: "Chlorofyl",
    distractors: [
      { value: "Chitin", why: "Chitin houby mají, je ve stěnách jejich buněk. Na výrobu živin ze světla neslouží." },
      { value: "Celulózu", why: "Celulóza tvoří stěny rostlinných buněk, světlo ale nezachytává. Živiny ze světla pomáhá vyrábět zelené barvivo." },
      { value: "Škrob", why: "Škrob si rostliny ukládají jako zásobu až z hotových cukrů. Světlo nezachytává, to dělá zelené barvivo." },
    ],
    hints: [
      "Vzpomeň si, co barví listy rostlin do zelena.",
      "Rostliny zachytí světlo zeleným barvivem v listech a vyrobí si cukry. Hledej látku, která světlo zachytává, ne látku, ze které jsou stěny buněk nebo zásoby.",
    ],
    explanation: "Houby nemají zelené barvivo chlorofyl. Bez něj nemohou dělat fotosyntézu, a proto přijímají živiny hotové.",
  },
  {
    q: "Jak se jmenuje část plodnice, která nese klobouk a spojuje ho se zemí?",
    correct: "Třeň",
    distractors: [
      { value: "Stonek", why: "Stonek mají rostliny. U plodnice houby má tahle část vlastní název." },
      { value: "Kořen", why: NEMA_KORENY },
      { value: "Podhoubí", why: "Podhoubí je spleť vláken v půdě. Klobouk nese část plodnice nad zemí." },
    ],
    hints: [
      "Mysli na „nožičku“, na které klobouk stojí.",
      "Plodnice má dvě hlavní části: nahoře klobouk a pod ním část, za kterou houbu držíš, když ji čistíš. Rostlinná slova tu nepoužívej.",
    ],
    explanation: "Klobouk nese třeň. Stonek a kořen mají rostliny. Podhoubí je skryté v půdě a z něj celá plodnice vyrůstá.",
  },
  {
    q: "Do které skupiny organismů houby patří?",
    correct: "Do samostatné říše hub",
    distractors: [
      { value: "Do říše zelených rostlin", why: NENI_ROSTLINA },
      { value: "Do říše bezobratlých živočichů", why: "Houby se nepohybují a nemají svaly ani nervy. Mezi živočichy nepatří." },
      { value: "Do skupiny zelených řas", why: "Řasy mají chlorofyl a dělají fotosyntézu. Houby chlorofyl nemají." },
    ],
    hints: [
      "Houby se od rostlin i živočichů liší tak, že tvoří vlastní skupinu.",
      "Rostliny a řasy mají chlorofyl, živočichové se pohybují a mají svaly. Houby nemají ani jedno, proto je vědci nezařadili ani k jedněm, ani k druhým.",
    ],
    explanation: "Houby nejsou rostliny ani živočichové. Nemají chlorofyl, nepohybují se a mají chitin v buněčných stěnách, proto tvoří samostatnou říši hub.",
  },
];

// ── L2 — POUŽITÍ NA KONKRÉTNÍ SITUACI ───────────────────────────────────────
// Kontexty: (a) rozkladač, (b) cizopasník, (c) soužití, (d) význam.
const ROZKLAD_NE_CIZOPAS =
  "Rozhoduje, jestli houba bere živiny z odumřelého dřeva (rozkladač), ze živého organismu, kterému škodí (cizopasník), nebo jestli si s ním živiny vyměňuje a oba mají užitek (soužití).";

export const POOL_L2: Polozka[] = [
  // (a) rozkladač
  {
    q: "Na starém pařezu v lese rostou drobné houby. Jak se živí?",
    correct: "Rozkládají odumřelé dřevo pařezu",
    distractors: [
      { value: "Cizopasí na pařezu a škodí mu", why: `Pařez je mrtvý, cizopasník škodí jen živému organismu. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Vyrábějí si živiny ze světla", why: NENI_ROSTLINA },
      { value: "Vyměňují si živiny s pařezem", why: `Výměna živin probíhá jen se živými kořeny. ${ROZKLAD_NE_CIZOPAS}` },
    ],
    hints: [
      "Je pařez ještě živý? Podle toho urči, odkud houby berou potravu.",
      "Pařez je zbytek pokáceného stromu, dřevo už nežije. Zeptej se, jak se jmenuje způsob výživy, při kterém houba zpracovává mrtvé zbytky.",
    ],
    explanation: "Pařez je odumřelé dřevo. Houby na něm jsou rozkladači (saprofyti): dřevo rozkládají a živiny z něj vracejí do půdy.",
  },
  {
    q: "Ve spadlém listí na podzim prorůstají bílá vlákna hub. Co tam houby dělají?",
    correct: "Rozkládají listí a vracejí živiny do půdy",
    distractors: [
      { value: "Vyrábějí si v listí cukry ze světla", why: NENI_ROSTLINA },
      { value: "Škodí stromu, ze kterého listí spadlo", why: `Spadané listí už ke stromu nepatří a strom tím nic neztrácí. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Chrání listí, aby se nerozpadlo", why: "Houby listí naopak rozkládají. Bez nich by se na zemi hromadilo." },
    ],
    hints: [
      "Spadané listí je mrtvé. Co se s ním v lese postupně stane?",
      "Listí na zemi během několika let zmizí a změní se v tmavou půdu. Zamysli se, kdo tu práci dělá a co z ní mají rostliny.",
    ],
    explanation: "Vlákna hub ve spadlém listí patří rozkladačům. Listí rozkládají a živiny z něj se vracejí do půdy, kde je využijí rostliny.",
  },
  {
    q: "Na zemi ve smrčině leží silná vrstva opadaného jehličí a v ní roste houba. Odkud bere živiny?",
    correct: "Z odumřelého jehličí, které rozkládá",
    distractors: [
      { value: "Ze živých jehlic, kterým škodí", why: `Jehličí na zemi už nežije. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Ze slunečního světla jako rostlina", why: NENI_ROSTLINA },
      { value: "Z výtrusů, které sama vytvoří", why: "Výtrusy slouží k rozmnožování, ne jako potrava. Houba potravu bere z okolí." },
    ],
    hints: [
      "Opadané jehličí je mrtvé. Co s ním může houba dělat?",
      "Houba si potravu nevyrobí, bere ji hotovou z toho, v čem roste. Zvaž, jaký materiál ji tady obklopuje a jestli ještě žije.",
    ],
    explanation: "Opadané jehličí je odumřelé. Houba v něm je rozkladač: jehličí rozkládá a bere si z něj živiny.",
  },
  // (b) cizopasník
  {
    q: "Choroš roste na živé bříze a strom postupně slábne. Jak se choroš živí?",
    correct: "Je cizopasník: bere živiny živé bříze",
    distractors: [
      { value: "Je rozkladač: rozkládá jen mrtvé dřevo", why: `Bříza žije a slábne, choroš jí tedy škodí. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Žije s břízou v soužití a pomáhá jí", why: "Při soužití oba prospívají. Tady bříza slábne, takže jí houba škodí." },
      { value: "Je rostlina: živiny si vyrábí ze světla", why: NENI_ROSTLINA },
    ],
    hints: [
      "Strom žije, a přesto slábne. Co to říká o vztahu houby ke stromu?",
      "Houba, která bere potravu živému hostiteli a tím ho oslabuje, patří do jiné skupiny než houba na mrtvém dřevě. Najdi možnost, která sedí k živému a slábnoucímu stromu.",
    ],
    explanation: "Choroš na živé bříze je cizopasník (parazit). Bere stromu živiny, bříza slábne a může i uhynout.",
  },
  {
    q: "Václavka napadla živý smrk, který začal chřadnout a nakonec uhynul. Jakou roli václavka hrála?",
    correct: "Cizopasila na smrku a zahubila ho",
    distractors: [
      { value: "Jen rozložila dřevo už mrtvého smrku", why: `Smrk byl při napadení živý a uhynul až potom. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Pomáhala smrku získávat vodu", why: "Pomoc s vodou patří k soužití. Smrk ale chřadl, takže mu houba škodila." },
      { value: "Vyráběla smrku cukry ze světla", why: NENI_ROSTLINA },
    ],
    hints: [
      "Dávej pozor na pořadí: strom byl nejdřív živý a uhynul až po napadení.",
      "Když strom chřadne až poté, co ho napadla houba, houba mu brala potravu. Rozkladač přichází až na mrtvé dřevo a soužití stromu prospívá.",
    ],
    explanation: "Václavka napadla živý smrk a brala mu živiny, byla tedy cizopasník. Strom chřadl a uhynul. Na mrtvém dřevě pak může václavka žít ještě dlouhá léta jako rozkladač.",
  },
  {
    q: "Na listech živé růže se objevil bílý povlak houby a listy se kroutí a žloutnou. Co houba dělá?",
    correct: "Cizopasí na růži a bere jí živiny",
    distractors: [
      { value: "Rozkládá listy, které už odumřely", why: `Listy byly živé a kroutí se a žloutnou až kvůli houbě. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Žije s růží v soužití a dodává jí vodu", why: "Při soužití rostlina prospívá. Tady se listy kroutí a žloutnou, takže jim houba škodí." },
      { value: "Vyrábí pro růži cukry ze světla", why: NENI_ROSTLINA },
    ],
    hints: [
      "Listy byly zdravé a začaly se kroutit a žloutnout až s povlakem. Kdo komu škodí?",
      "Houba na živé rostlině, která rostlinu oslabuje, se živí na její úkor. Porovnej to s houbou, která žije jen na odumřelých zbytcích.",
    ],
    explanation: "Bílý povlak na živých listech tvoří cizopasná houba. Bere růži živiny, listy se kroutí, žloutnou a opadávají. Houby tak způsobují choroby rostlin.",
  },
  {
    q: "Lesník našel na živém buku choroš a řekl, že strom bude slábnout. Proč?",
    correct: "Choroš je cizopasník a odebírá buku živiny",
    distractors: [
      { value: "Choroš je rozkladač a bere buku jen mrtvé listí", why: `Mrtvé listí stromu nechybí. Slábnutí způsobí houba, která bere živiny živému stromu. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Choroš je rostlina a zastiňuje buku listy", why: NENI_ROSTLINA },
      { value: "Choroš žije s bukem v soužití a vodu mu bere", why: "Při soužití houba stromu vodu naopak dodává a oba mají užitek." },
    ],
    hints: [
      "Buk je živý a bude slábnout. Která skupina hub živým stromům škodí?",
      "Strom slábne, když mu někdo bere potravu. Rozkladač se živí mrtvým dřevem a při soužití strom prospívá, takže tyto dvě cesty tu nesedí.",
    ],
    explanation: "Choroš na živém stromě je cizopasník. Odebírá buku živiny a rozkládá jeho dřevo, a strom proto slábne.",
  },
  // (c) soužití
  {
    q: "Hřib smrkový roste v lese u stromů, nejčastěji u smrků. Jaký je vztah hřibu a smrku?",
    correct: "Hřib a smrk žijí v soužití a vyměňují si živiny",
    distractors: [
      { value: "Hřib cizopasí na smrku a škodí mu", why: `Smrky s hřiby jsou zdravé, žádný z nich neslábne. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Hřib rozkládá odumřelé kořeny smrku", why: "Hřib je spojený se živými kořeny, ne s mrtvými. Rozkladači rostou na odumřelých zbytcích." },
      { value: "Hřib si vyrábí živiny a dává je smrku", why: NENI_ROSTLINA },
    ],
    hints: [
      "Smrky s hřiby jsou zdravé. Mají z toho vztahu užitek oba?",
      "Vlákna hřibu obalují živé kořeny smrku. Přemýšlej, co může dát houba stromu z půdy a co strom houbě ze svých jehlic.",
    ],
    explanation: "Hřib žije se smrkem v soužití (mykorhize). Houba dává stromu vodu a minerální látky, strom houbě cukry. Proto hřib roste u stromů, se kterými žije v soužití, u nás nejčastěji u smrků.",
  },
  {
    q: "Kozák březový roste jen tam, kde jsou břízy. Co si houba a bříza navzájem dávají?",
    correct: "Vyměňují si: houba dává vodu a minerální látky, bříza cukry",
    distractors: [
      { value: "Vyměňují si: bříza dává vodu a minerální látky, houba cukry", why: `Houba cukry vyrobit nedokáže. ${NENI_ROSTLINA}` },
      { value: "Nic si nedávají: houba bříze jen bere cukry a škodí", why: `Břízy s kozáky prospívají. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Nic si nedávají: jen náhodou rostou na stejném místě", why: "Kozák březový roste jen u bříz, a to náhoda není. Jeho vlákna jsou spojená s kořeny břízy." },
    ],
    hints: [
      "Rozmysli si, kdo z nich umí vyrobit cukry a kdo má vlákna v celé půdě.",
      "Cukry vyrábí jen organismus s chlorofylem. Houbová vlákna prorůstají velkým kusem půdy a sbírají z ní to, co kořeny samy nedosáhnou. Z toho odvoď, kdo co dává.",
    ],
    explanation: "Kozák březový a bříza žijí v soužití. Houbová vlákna dodávají bříze vodu a minerální látky z půdy a bříza houbě dává cukry, které si vyrobila v listech.",
  },
  {
    q: "Křemenáč osikový roste pod osikami a jeho vlákna obalují jejich kořeny. Jaký vztah mají křemenáč a osika?",
    correct: "Soužití, ve kterém si vyměňují živiny",
    distractors: [
      { value: "Cizopasnictví, ve kterém houba osiku oslabuje", why: `Osiky s křemenáči jsou zdravé. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Rozklad, při kterém houba tráví mrtvé kořeny", why: "Kořeny osiky jsou živé. Rozkladači se živí odumřelými zbytky." },
      { value: "Žádný, houba si živiny vyrábí ze světla", why: NENI_ROSTLINA },
    ],
    hints: [
      "Vlákna obalují živé kořeny zdravého stromu. Kdo z toho má užitek?",
      "Strom neslábne a kořeny nejsou mrtvé. Hledej vztah, ve kterém houba i strom něco dostávají a nikdo nestrádá.",
    ],
    explanation: "Křemenáč osikový a osika žijí v soužití (mykorhize). Houba dodává stromu vodu a minerální látky, strom jí dává cukry.",
  },
  {
    q: "Hřib roste u kořenů smrku a jeho vlákna kořeny obalují. Co dostává hřib od smrku?",
    correct: "Cukry, které smrk vyrobil v jehlicích na světle",
    distractors: [
      { value: "Vodu a minerální látky z hloubky půdy", why: "To je obráceně: vodu a minerální látky dodává stromu houba svými vlákny." },
      { value: "Světlo, které hřib potřebuje k fotosyntéze", why: NENI_ROSTLINA },
      { value: "Nic, hřib smrku jen bere živiny a škodí mu", why: `Smrk s hřibem je zdravý, jde o výměnu. ${ROZKLAD_NE_CIZOPAS}` },
    ],
    hints: [
      "Co umí vyrobit smrk a houba ne?",
      "Strom si na světle vyrábí látky, které houba sama vytvořit nedokáže. Houba mu za ně dodává to, co vlákny nasbírá v půdě. Zeptej se, co z toho putuje ke kořenům od stromu.",
    ],
    explanation: "Smrk si v jehlicích na světle vyrábí cukry a část jich předá houbě. Hřib mu za to dodává vodu a minerální látky z půdy. Tak vypadá soužití.",
  },
  // (d) význam
  {
    q: "Pekař přidá do těsta droždí a těsto nakyne. Co způsobilo, že těsto kynulo?",
    correct: "Kvasinky v droždí, které uvolňují plyn",
    distractors: [
      { value: "Prášek z rozemletých rostlin v droždí", why: "Droždí není rostlinný prášek. Jsou to živé kvasinky, tedy houby." },
      { value: "Plíseň, která těsto nafoukne vlákny", why: "Plíseň jídlo kazí a těsto nekypří. Kyne díky jednobuněčným houbám." },
      { value: "Bakterie, které se dostaly z mouky", why: "Do těsta se přidává droždí a v něm nejsou bakterie, ale houby." },
    ],
    hints: [
      "Droždí je hmota z drobných živých organismů. Které houby to jsou?",
      "V droždí jsou miliony jednobuněčných hub. Při kvašení z nich unikají bublinky plynu a ty těsto nadzvednou. Plíseň a bakterie mezi ně nepatří.",
    ],
    explanation: "Droždí tvoří kvasinky, jednobuněčné houby. Při kvašení uvolňují plyn, jehož bublinky těsto nakypří.",
  },
  {
    q: "Z jedné plísně se vyrábí lék, který ničí bakterie. O jaký lék jde?",
    correct: "Antibiotikum penicilin",
    distractors: [
      { value: "Očkovací látka proti chřipce", why: "Očkovací látka chrání před virem, ne před bakteriemi, a z plísně se nevyrábí." },
      { value: "Vitamin C proti nachlazení", why: "Vitamin C se získává hlavně z ovoce a zeleniny. Bakterie neničí." },
      { value: "Sirup proti virové rýmě", why: "Viry nejsou bakterie. Lék z plísně na viry nezabírá." },
    ],
    hints: [
      "Hledáš lék, který lékař předepisuje na bakteriální záněty.",
      "Léky, které ničí bakterie, mají společné jméno. Ten první objevil vědec, když si všiml, že kolem plísně bakterie nerostou. Na viry tyto léky nepůsobí.",
    ],
    explanation: "Z plísně se vyrábí antibiotikum penicilin. Ničí bakterie, a proto se jím léčí bakteriální infekce. Na viry antibiotika nezabírají.",
  },
  {
    q: "Na krajíci chleba se objevila malá zelená skvrna plísně. Co je správné udělat?",
    correct: "Vyhodit celý chléb, plíseň prorůstá dovnitř",
    distractors: [
      { value: "Odříznout skvrnu a zbytek chleba sníst", why: "Vlákna plísně prorůstají hluboko do potraviny, i když je nevidíme, proto se plesnivé jídlo vyhazuje celé." },
      { value: "Chléb opéct, teplo plíseň úplně zničí", why: "Opečením se škodlivé látky z plísně neodstraní. Plesnivý chléb se vyhazuje celý." },
      { value: "Dát chléb do lednice, plíseň tam zmizí", why: "Chlad růst plísně jen zpomalí, nezničí ji. Plesnivý chléb se vyhazuje." },
    ],
    hints: [
      "Plíseň je houba. Vzpomeň si, co tvoří tělo houby a kam až sahá.",
      "Skvrna na povrchu je jen část plísně, kterou vidíš. Vlákna podhoubí jsou tenká a sahají mnohem hlouběji do chleba. Z toho odvoď, jestli stačí skvrnu odstranit.",
    ],
    explanation: "Skvrna je jen viditelná část plísně. Její vlákna prorůstají chléb hluboko dovnitř a mohou tvořit škodlivé látky, proto se plesnivý chléb vyhazuje celý.",
  },
  {
    q: "Houby v lese zpracovávají spadlé listí a mrtvé dřevo. K čemu je to lesu dobré?",
    correct: "Živiny se vracejí do půdy a využijí je rostliny",
    distractors: [
      { value: "Listí díky tomu vydrží na zemi déle", why: "Houby listí naopak rozkládají, takže z povrchu mizí." },
      { value: "Houby tím stromům berou potravu", why: "Spadané listí a mrtvé dřevo stromy už nepotřebují. Živiny z nich stromům naopak pomohou." },
      { value: "Houby si tím vyrábějí cukry pro stromy", why: NENI_ROSTLINA },
    ],
    hints: [
      "Mysli na to, co se z listí stane a kdo z toho má užitek.",
      "Rozložené listí a dřevo se změní v látky v půdě. Zeptej se, kdo je z půdy nasává kořeny a potřebuje je k růstu.",
    ],
    explanation: "Houby rozkládají odumřelé listí a dřevo na jednoduché látky. Ty se vracejí do půdy a rostliny je znovu použijí. Bez hub by se živiny do lesní půdy vracely mnohem pomaleji.",
  },
  // (c) soužití — jiné rozhodnutí než „živé, nebo mrtvé“
  {
    q: "Lesník sází mladé břízy na holinu. Do každé jamky přidá hrst hlíny z březového lesa, ve které jsou vlákna hub. Proč to dělá?",
    correct: "Houby obalí kořeny a dodají břízám vodu",
    distractors: [
      { value: "Houby rozloží kořeny bříz a uvolní z nich živiny", why: "Kořeny mladých bříz jsou živé. Rozkladači se živí odumřelými zbytky, ne živými kořeny." },
      { value: "Houby vyrobí mladým břízám cukry ze světla", why: NENI_ROSTLINA },
      { value: "Vlákna hub nahradí mladým břízám kořeny", why: "Břízy mají vlastní kořeny. Houbová vlákna je jen obalí a pomáhají jim sbírat vodu z větší plochy půdy." },
    ],
    hints: [
      "Mladé břízy jsou živé a teprve rostou. Jaký vztah s nimi mohou mít houby z březového lesa?",
      "V březovém lese žijí houby, jejichž vlákna jsou spojená s kořeny bříz, a užitek z toho mají oba. Zvaž, co houba stromu dává a co by mu na holině chybělo.",
    ],
    explanation: "V hlíně z březového lesa jsou vlákna hub, které s břízami žijí v soužití (mykorhize). Obalí kořeny mladých bříz a dodávají jim vodu a minerální látky, bříza jim dává cukry. Stromky proto lépe rostou.",
  },
  // (e) stavba
  {
    q: "Plodnice je jen malá část houby. Která část je největší a zůstává v zemi celý rok?",
    correct: "Podhoubí z vláken prorůstajících půdou",
    distractors: [
      { value: "Kořeny, které houbu drží v zemi", why: NEMA_KORENY },
      { value: "Třeň, který pokračuje hluboko do země", why: "Třeň je součást plodnice a končí u povrchu. Pod zemí je jiná část." },
      { value: "Výtrusy, které čekají v zemi na jaro", why: "Výtrusy slouží k rozmnožování a roznáší je vítr. Tělem houby nejsou." },
    ],
    hints: [
      "Mysli na to, z čeho plodnice vyrůstá.",
      "Plodnice se objeví jen na pár dní, ale houba žije v zemi dál. Její tělo tvoří tenká vlákna, která zabírají mnohem víc místa než to, co vidíš nad zemí.",
    ],
    explanation: "Největší část houby je podhoubí, spleť vláken v půdě. Žije celý rok a plodnice z něj vyroste jen tehdy, když má houba tvořit výtrusy.",
  },
];

/** Pořadí banky L2: kontexty se střídají, aby každých 6 úloh pokrylo víc typů. */
const PORADI_L2 = [0, 3, 7, 11, 1, 4, 8, 12, 15, 2, 5, 9, 13, 16, 6, 10, 14];

// ── L3 — PŘENOS A ANALÝZA ───────────────────────────────────────────────────
export const POOL_L3: Polozka[] = [
  {
    q: "Ve sklepě bez oken roste na starém dřevě houba. Proč jí nevadí tma?",
    correct: "Protože živiny bere hotové ze dřeva",
    distractors: [
      { value: "Protože zelené barvivo pracuje i ve tmě", why: NENI_ROSTLINA },
      { value: "Protože jí k výrobě živin stačí trocha světla", why: NENI_ROSTLINA },
      { value: "Protože ve tmě jen spí a živiny nepotřebuje", why: "Houba ve sklepě roste, a na růst živiny potřebuje. Bere je z okolí." },
    ],
    hints: [
      "Co houba potřebuje k životu a co ne?",
      "Rostlina bez světla hyne, protože si potravu vyrábí. Zeptej se, jestli si houba potravu vyrábí, nebo ji odněkud bere, a odkud by ji ve sklepě brala.",
    ],
    explanation: "Houba si živiny nevyrábí, nepotřebuje tedy světlo. Bere je hotové z dřeva, které rozkládá. Proto může růst i v úplné tmě.",
  },
  {
    q: "Proč houbař plodnici opatrně odřízne nebo vykroutí a nevyhrabává mech a půdu kolem?",
    correct: "Aby podhoubí v půdě zůstalo a houba vyrostla znovu",
    distractors: [
      { value: "Aby v zemi zůstaly kořeny, ze kterých houba vyroste", why: NEMA_KORENY },
      { value: "Aby v zemi zůstala semena pro nové houby", why: NEMA_SEMENA },
      { value: "Aby plodnice po utržení ještě chvíli rostla", why: "Utržená plodnice už neroste. Dál žije jen to, co zůstalo v zemi." },
    ],
    hints: [
      "Kde je ta část houby, kterou nevidíš?",
      "Plodnice je jen malá část houby. Hlavní tělo je skryté pod mechem a v půdě. Zamysli se, co by se s ním stalo, kdyby houbař půdu rozhrabal.",
    ],
    explanation: "Pod zemí zůstává podhoubí, hlavní a trvalá část houby. Když ho houbař nepoškodí, vyroste z něj příště nová plodnice.",
  },
  {
    q: "Houbař našel v lese houby, které rostou v pravidelném kruhu. Jak je to možné?",
    correct: "Rostou z jednoho podhoubí, které se šíří do stran",
    distractors: [
      { value: "Rostou z kořenů jedné houby, které se stáčejí do kruhu", why: "Kořeny mají rostliny. Houba se v půdě šíří jemnými vlákny, která rostou do stran." },
      { value: "Vyrostly ze semen, která plodnice vysypala dokola", why: "Semena mají rostliny. Houba tvoří výtrusy a vítr je roznáší daleko, ne do úhledného kruhu." },
      { value: "Jsou to samostatné houby, které se sešly náhodou", why: "Houby v kruhu spolu souvisejí. Vyrůstají z jedné spleti vláken, která se šíří od místa, kde začala." },
    ],
    hints: [
      "Mysli na to, z čeho plodnice vyrůstají a jak se ta část houby v zemi šíří.",
      "Plodnice jsou jen to, co vidíš nad zemí. Pod zemí je spleť vláken, která každý rok o kus poroste na všechny strany stejně. Zvaž, kde na ní pak plodnice vyrážejí.",
    ],
    explanation: "Pod zemí roste jedno podhoubí. Z místa, kde začalo, se rozrůstá na všechny strany stejně a plodnice vyrážejí na jeho okraji. Proto tvoří kruh.",
  },
  {
    q: "K čemu je dobré, že má plodnice pod kloboukem rourky nebo lupeny s obrovskou plochou?",
    correct: "Vytvoří a uvolní velké množství výtrusů",
    distractors: [
      { value: "Vytvoří a uvolní velké množství semen", why: NEMA_SEMENA },
      { value: "Zachytí velké množství světla pro výrobu živin", why: NENI_ROSTLINA },
      { value: "Nasaje velké množství vody z ranní rosy", why: "Vodu houba přijímá hlavně vlákny v půdě. Rourky a lupeny slouží k rozmnožování." },
    ],
    hints: [
      "Co přesně se v rourkách a lupenech tvoří?",
      "Čím větší plocha, tím víc drobných tělísek se na ní vejde. Vítr jich většinu zanese na místa, kde houba nevyroste, a tak se jich musí vytvořit hodně.",
    ],
    explanation: "Rourky a lupeny mají velkou plochu, a tak se na nich vytvoří obrovské množství výtrusů. Většina se ztratí, ale když jich je hodně, některé dopadnou na vhodné místo.",
  },
  {
    q: "V lese rostl kozák březový, který roste jen u bříz. Pak tam vykáceli všechny břízy. Co se nejspíš stane s kozáky?",
    correct: "Přestanou růst, protože ztratily strom, se kterým žily v soužití",
    distractors: [
      { value: "Porostou lépe, protože na ně teď dopadne víc světla", why: NENI_ROSTLINA },
      { value: "Nic se nezmění, protože si živiny vyrobí samy", why: NENI_ROSTLINA },
      { value: "Porostou lépe, protože jim břízy braly cukry", why: "Bříza houbě cukry naopak dávala. Bez ní kozák potravu ztratí." },
    ],
    hints: [
      "Zamysli se, proč kozák březový neroste jinde než u bříz.",
      "Kozák a bříza si vyměňovali látky: houba dávala stromu vodu, strom jí dával potravu. Zvaž, co houbě chybí, když strom zmizí.",
    ],
    explanation: "Kozák březový žije s břízou v soužití a dostává od ní cukry. Když břízy zmizí, houba ztratí zdroj potravy a přestane růst.",
  },
  {
    q: "Co by se stalo, kdyby v lese nežily žádné rozkládající houby?",
    correct: "Listí a dřevo by se hromadily a půda by chudla",
    distractors: [
      { value: "Stromy by rostly lépe, nic by jim nebralo živiny", why: "Rozkladači stromům nic neberou, naopak jim vracejí živiny do půdy." },
      { value: "Listí by se na zemi samo rozplynulo za pár dní", why: "Listí se samo nerozloží. Rozklad dělají hlavně houby a trvá měsíce až roky." },
      { value: "Les by měl více živin, protože by je nikdo nespotřeboval", why: "Živiny v mrtvém listí jsou pro rostliny nedostupné, dokud je rozkladači, hlavně houby, nerozloží." },
    ],
    hints: [
      "Zeptej se, co v lese rozkladači dělají a co by zůstalo neudělané.",
      "Každý podzim spadne nová vrstva listí. Pokud ji nikdo nezpracuje, zůstane ležet. Přemýšlej, odkud by pak rostliny braly látky z půdy.",
    ],
    explanation: "Bez rozkladačů by se odumřelé listí a dřevo hromadily. Živiny by v nich zůstaly uzavřené a půda by chudla, takže by rostlinám časem chyběla výživa.",
  },
  {
    q: "Organismus nemá chlorofyl, jeho tělo tvoří vlákna a rozmnožuje se výtrusy. Kam patří?",
    correct: "Mezi houby",
    distractors: [
      { value: "Mezi rostliny", why: "Rostliny mají chlorofyl. Tenhle organismus ho nemá." },
      { value: "Mezi řasy", why: "Řasy mají chlorofyl a dělají fotosyntézu. Tenhle organismus ho nemá." },
      { value: "Mezi živočichy", why: "Živočichové se nerozmnožují výtrusy a jejich tělo netvoří vlákna." },
    ],
    hints: [
      "Porovnej každý znak se skupinami v nabídce a škrtej.",
      "Chybějící zelené barvivo vyřadí dvě skupiny. Tělo z vláken a rozmnožování drobnými tělísky, která roznáší vítr, pak nesedí ani na zvířata.",
    ],
    explanation: "Bez chlorofylu, s tělem z vláken a s výtrusy: to jsou znaky hub. Rostliny a řasy chlorofyl mají a živočichové výtrusy netvoří.",
  },
  {
    q: "U tvrdého sýra s malou skvrnou plísně se může odkrojit velký kus kolem skvrny. Proč se ale plesnivý jogurt nebo marmeláda vyhazují celé?",
    correct: "Měkkým a vlhkým jídlem vlákna prorostou snadno a hluboko",
    distractors: [
      { value: "V sýru plíseň nemá kořeny, v jogurtu a marmeládě ano", why: "Kořeny mají rostliny, plíseň žádné nemá. V obou jídlech roste jemnými vlákny, jen v měkkém jídle pronikají hlouběji." },
      { value: "Plíseň na sýru je vždy neškodná, na jogurtu jedovatá", why: "Škodlivé látky může tvořit plíseň v obou jídlech. Rozhoduje, jak hluboko její vlákna proniknou." },
      { value: "Jogurt a marmeláda jsou levné, krájet je se nevyplatí", why: "Nejde o cenu, ale o zdraví. Rozhoduje, kam až vlákna plísně prorůstají." },
    ],
    hints: [
      "Plíseň je houba z vláken. Kudy se vlákna prodírají snáz: pevnou hmotou, nebo řídkou?",
      "Na povrchu vidíš jen skvrnu, tělo plísně tvoří tenká vlákna uvnitř jídla. Porovnej, jak hluboko se dostanou do pevného sýra a jak do řídkého jogurtu.",
    ],
    explanation: "Vlákna plísně prorůstají jídlo pod viditelnou skvrnou. Tvrdým sýrem pronikají pomalu a jen kousek, proto stačí odkrojit velký kus kolem skvrny. Měkkým a vlhkým jídlem prorostou snadno a hluboko, a proto se vyhazuje celé.",
  },
  {
    q: "Houbař utrhl houbu a za rok na stejném místě vyrostla znovu. Jak je to možné?",
    correct: "Podhoubí v půdě přežilo a vytvořilo novou plodnici",
    distractors: [
      { value: "Semena z utržené houby spadla do půdy a vyklíčila", why: NEMA_SEMENA },
      { value: "Kořeny v půdě přežily a vyhnaly nový stonek", why: NEMA_KORENY },
      { value: "Utržená houba v zemi znovu zakořenila a dorostla", why: "Utržená plodnice už nedoroste. Nová vyroste z toho, co zůstalo v zemi." },
    ],
    hints: [
      "Utrhl houbař celou houbu, nebo jen její část?",
      "Nad zemí houbař vzal jen tu část, která tvoří výtrusy. Hlavní tělo houby zůstalo skryté v zemi a žilo dál. Zeptej se, co z něj může za rok vyrůst.",
    ],
    explanation: "Houbař utrhl jen plodnici. Podhoubí v půdě žilo dál a za rok z něj vyrostla nová plodnice na stejném místě.",
  },
  {
    q: "Kvasinka je houba, i když ji okem nevidíme a nemá klobouk. Který znak ji s houbami spojuje?",
    correct: "Nemá chlorofyl a živiny přijímá hotové",
    distractors: [
      { value: "Má chlorofyl a živiny si vyrábí ze světla", why: NENI_ROSTLINA },
      { value: "Má drobné kořínky, kterými saje cukr", why: "Kořeny mají rostliny. Kvasinka je jediná buňka a živiny přijímá celým povrchem." },
      { value: "Pohybuje se a potravu loví jako živočich", why: "Kvasinka se aktivně nepohybuje ani neloví. Živiny přijímá z okolí." },
    ],
    hints: [
      "Zeptej se, co mají všechny houby společné, ať jsou velké nebo malé.",
      "Klobouk a třeň mají jen některé houby. Pro zařazení rozhoduje způsob výživy: jestli si organismus potravu vyrábí, nebo ji bere z okolí.",
    ],
    explanation: "Kvasinka nemá chlorofyl a bere živiny hotové, třeba cukr z těsta. To je znak všech hub, i když kvasinka nemá plodnici.",
  },
  {
    q: "Proč houby rostou nejvíc v lese, kde je hodně opadu, dřeva a stromů?",
    correct: "Najdou tu hotové živiny i stromy pro soužití",
    distractors: [
      { value: "Najdou tu nejvíc světla pro výrobu živin", why: NENI_ROSTLINA },
      { value: "Najdou tu semena, ze kterých vyklíčí", why: NEMA_SEMENA },
      { value: "Najdou tu živé stromy, na kterých všechny cizopasí", why: `Cizopasníků je jen část hub. ${ROZKLAD_NE_CIZOPAS}` },
    ],
    hints: [
      "Zamysli se, jakou potravu houba potřebuje a kde ji v lese najde.",
      "Některé houby se živí mrtvým listím a dřevem, jiné si vyměňují látky s kořeny. Najdi možnost, která sedí na obě skupiny zároveň.",
    ],
    explanation: "Houby si živiny nevyrábějí. V lese mají dost odumřelého listí a dřeva k rozkladu a živé stromy, se kterými žijí v soužití.",
  },
  {
    q: "Houbař hledá hřiby. Kde je má hledat spíš: v lese u smrků, nebo na louce bez stromů? Proč?",
    correct: "U smrků, hřib potřebuje strom pro soužití",
    distractors: [
      { value: "Na louce, hřib potřebuje hodně světla", why: NENI_ROSTLINA },
      { value: "Na louce, stromy by hřibu braly živiny", why: "Strom hřibu živiny nebere, naopak mu dává cukry." },
      { value: "U smrků, hřib tam cizopasí na kořenech", why: `Smrky s hřiby jsou zdravé, hřib jim neškodí. ${ROZKLAD_NE_CIZOPAS}` },
    ],
    hints: [
      "Jak se hřib živí? Podle toho urči, bez čeho se neobejde.",
      "Hřib má vlákna spojená s kořeny živých stromů a dostává od nich potravu. Zvaž, jestli by na louce bez stromů měl odkud ji brát, a zkontroluj i zdůvodnění.",
    ],
    explanation: "Hřib žije se smrkem v soužití a dostává od něj cukry. Na louce bez stromů by potravu neměl, proto se hledá v lese u smrků.",
  },
  {
    q: "Na čem se pozná, že houba na kmeni je cizopasník, a ne rozkladač?",
    correct: "Kmen, na kterém roste, je živý a slábne",
    distractors: [
      { value: "Kmen, na kterém roste, je mrtvý a trouchnivý", why: `Na mrtvém dřevě rostou rozkladači. ${ROZKLAD_NE_CIZOPAS}` },
      { value: "Houba je větší než ostatní houby v lese", why: "Velikost o způsobu výživy nic neříká. Rozhoduje, jestli hostitel žije." },
      { value: "Houba má zelenou barvu jako listy stromu", why: NENI_ROSTLINA },
    ],
    hints: [
      "Oba typy hub mohou růst na dřevě. V čem se liší dřevo, ze kterého berou potravu?",
      "Jeden typ houby se živí mrtvým dřevem, druhý bere potravu organismu, který ještě žije, a tím ho oslabuje. Hledej znak na stromu, ne na houbě.",
    ],
    explanation: "Cizopasník bere živiny živému organismu a škodí mu, takže strom je živý a slábne. Rozkladač roste na mrtvém dřevě. Barva ani velikost houby nerozhodují.",
  },
  {
    q: "Plíseň roste na chlebu a kvasinka v těstě. Co mají společné?",
    correct: "Obě jsou houby a berou hotové živiny",
    distractors: [
      { value: "Obě jsou rostliny s drobnými listy", why: NENI_ROSTLINA },
      { value: "Obě jsou bakterie, které jen kazí jídlo", why: "Plíseň i kvasinka jsou houby. Kvasinka navíc jídlo nekazí, ale pomáhá při pečení." },
      { value: "Obě se rozmnožují semeny v potravině", why: "Semena mají rostliny. Plíseň tvoří drobné výtrusy, kvasinka se množí hlavně pučením." },
    ],
    hints: [
      "Zeptej se, do které říše patří každá z nich a jak se živí.",
      "Jedna jídlo kazí a druhá pomáhá pečivu, přesto patří do stejné skupiny. Obě berou potravu z toho, na čem rostou. Vylouč možnosti, které jim přisuzují znaky jiných organismů.",
    ],
    explanation: "Plíseň i kvasinka jsou houby. Nemají chlorofyl a berou živiny hotové: plíseň z chleba, kvasinka z cukru v těstě.",
  },
  {
    q: "Vědci chtějí zjistit, jestli neznámý organismus je houba, nebo rostlina. Co by měli hledat?",
    correct: "Jestli má zelené barvivo chlorofyl",
    distractors: [
      { value: "Jestli roste ze země, nebo na dřevě", why: "Houby i rostliny rostou na zemi i na dřevě. Místo nic nerozhodne." },
      { value: "Jestli má nahoře klobouk a pod ním třeň", why: "Klobouk mají jen některé houby, kvasinky a plísně ne. To nerozhodne spolehlivě." },
      { value: "Jestli se dá uvařit a sníst", why: "Jíst se dají rostliny i houby. Jedlost o zařazení nic neříká." },
    ],
    hints: [
      "Hledej znak, který mají téměř všechny rostliny a žádná houba.",
      "Místo, tvar i jedlost se u hub i rostlin liší případ od případu. Rozhodne jen znak spojený se způsobem výživy, tedy s tím, jestli si organismus vyrábí potravu ze světla.",
    ],
    explanation: "Rostliny mají chlorofyl a vyrábějí si živiny ze světla, houby ho nemají. Proto je chlorofyl nejsnáze použitelný rozlišovací znak (vzácně existují i cizopasné rostliny bez chlorofylu). Klobouk, místo ani jedlost nerozhodují.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  buildChoiceTask(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? POOL_L1 : level === 2 ? PORADI_L2.map((k) => POOL_L2[k]) : POOL_L3;
  let i = 0;
  const dalsi = () => vytvor(pool[i++ % pool.length]);
  return ruzneUlohy(() => losUlohy(dalsi), pool.length, pool.length * 3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const HOUBY_STAVBA_VYZIVA_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-pri-houby-stavba-vyziva-vyznam-6",
    rvpNodeId: "g6-prirodopis-biologie-hub-houby-a-lisejniky-houby-stavba-vyziva-vyznam",
    displayName: "Houby – stavba, výživa, význam",
    title: "Houby - stavba, výživa, význam",
    studentTitle: "Houby – z čeho jsou a čím se živí",
    subject: "prirodopis",
    category: "Biologie hub",
    topic: "Houby a lišejníky",
    briefDescription: "Podhoubí, plodnice, výtrusy – jak se houby živí a k čemu jsou",
    keywords: [
      "houby", "podhoubí", "plodnice", "výtrusy", "rourky", "lupeny", "chitin",
      "chlorofyl", "rozkladač", "cizopasník", "soužití", "mykorhiza", "kvasinky",
      "droždí", "plíseň", "penicilin", "choroš", "václavka",
    ],
    goals: [
      "Pojmenovat části houby (podhoubí, plodnice, třeň, klobouk, rourky, lupeny) a jejich úlohu.",
      "Vysvětlit, proč houba není rostlina, a rozlišit rozkladače, cizopasníky a houby v soužití.",
      "Uvést význam hub v přírodě i pro člověka a správně naložit s plesnivým jídlem.",
    ],
    boundaries: [
      "Jen shodná fakta z učebnic 6. ročníku; saprofyt a parazit jen v závorce, nikdy jako klíč.",
      "Bez určování jedlých a jedovatých hub (to je sousední podtéma).",
      "Lišejníky jen jako distraktor; soužití hub s řasou se tu neprocvičuje.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Houba nemá chlorofyl, živiny si nevyrábí. Z mrtvých zbytků = rozkladač, ze živého organismu, kterému škodí = cizopasník, výměna se stromem = soužití.",
      steps: [
        "Zjisti, jestli je organismus nebo dřevo, na kterém houba roste, živé, nebo mrtvé.",
        "Rozhodni, jestli houba hostiteli škodí, nebo si s ním živiny vyměňuje.",
        "Vylouč možnosti, které houbě přisuzují fotosyntézu, kořeny nebo semena.",
      ],
      commonMistake: "Považovat houbu za rostlinu (fotosyntéza, kořeny, semena) nebo zaměnit rozkladače za cizopasníka.",
      example: "Houba na pařezu je rozkladač, choroš na živé bříze cizopasník a hřib u smrku žije se stromem v soužití.",
    },
  },
];
