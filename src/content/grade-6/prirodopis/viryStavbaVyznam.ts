/**
 * Přírodopis 6. ročník — Viry: stavba, význam, virová onemocnění (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3). Každá položka má vlastní
 * znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • vir je jen malá bakterie, tedy buňka s jádrem a cytoplazmou, a dělí se;
 *  • antibiotika vyléčí každou infekci, i chřipku a rýmu;
 *  • záměna virové a bakteriální nemoci (angína, borelióza, tetanus);
 *  • vir se množí kdekoli (prach, klika, voda) a je vidět školním mikroskopem.
 *
 *  • L1 — zapamatování: stavba viru, kde se množí, čím se zkoumá, která nemoc je virová.
 *  • L2 — použití: situace z běžného života (rada nemocnému, cesta nákazy, prevence).
 *  • L3 — analýza a přenos: neznámý útvar nebo nemoc z popisu, znak → důsledek.
 *
 * Zdravotní rady jsou jen bezpečné: při nemoci k lékaři, antibiotika nikdy
 * „sám na virózu“, po kousnutí zvířetem hned k lékaři.
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

// Bakteriální nemoci — distraktory k „která nemoc je virová“ (chyba: záměna původce).
const ANGINA: Distractor = { value: "Hnisavá angína", why: "Hnisavou angínu způsobují bakterie (streptokoky), proto ji lékař léčí antibiotiky. Virová není." };
const BORELIOZA: Distractor = { value: "Lymeská borelióza", why: "Boreliózu sice přenáší klíště, ale způsobuje ji bakterie. Léčí se antibiotiky a očkování proti ní zatím není." };
const TETANUS: Distractor = { value: "Tetanus", why: "Tetanus způsobuje bakterie z půdy, která se dostane do rány. Očkuje se proti němu, ale je to bakteriální nemoc." };
const SALMONELOZA: Distractor = { value: "Salmonelóza", why: "Salmonelózu způsobují bakterie salmonely, třeba ze špatně tepelně upravených vajec nebo masa." };
const TUBERKULOZA: Distractor = { value: "Tuberkulóza", why: "Tuberkulózu způsobuje bakterie. Je to bakteriální nemoc hlavně plic a léčí se antibiotiky." };

const NEMA_BUNKU = "Vir nemá buněčnou stavbu: je to jen dědičná informace v bílkovinném obalu a sám se nedělí.";
const ANTIBIOTIKA = "Antibiotika působí na bakterie, na viry ne. U virózy pomáhá klid a pití a léčbu určí lékař.";
const MIMO_BUNKU = "Mimo živou buňku se vir nemnoží, na předmětech jen chvíli přetrvá.";

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka → fakt ─────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Z čeho se skládá vir?",
    correct: "Z dědičné informace v bílkovinném obalu",
    distractors: [
      { value: "Z jádra, cytoplazmy a buněčné stěny", why: `To je popis buňky. ${NEMA_BUNKU}` },
      { value: "Z jediné buňky bez jádra, jako bakterie", why: `Takhle vypadá bakterie. ${NEMA_BUNKU}` },
      { value: "Z mnoha drobných buněk slepených dohromady", why: `Vir není mnohobuněčný, nemá ani jednu buňku. ${NEMA_BUNKU}` },
    ],
    hints: [
      "Vzpomeň si, že vir je mnohem jednodušší než jakákoli buňka. Které možnosti popisují buňku?",
      "Vir má jen dvě části: uvnitř návod, podle kterého vznikají nové viry, a kolem něj ochranný obal. Jádro, cytoplazmu ani buněčnou stěnu nemá.",
    ],
    explanation: "Vir tvoří jen dědičná informace (nukleová kyselina) a bílkovinný obal kolem ní. Nemá jádro, cytoplazmu ani buněčnou stěnu, proto nemá buněčnou stavbu.",
  },
  {
    q: "Čím se liší stavba viru od stavby bakterie?",
    correct: "Vir nemá buněčnou stavbu, bakterie ano",
    distractors: [
      { value: "Vir má jádro, bakterie jádro nemá", why: `Jádro nemá ani jeden z nich. ${NEMA_BUNKU}` },
      { value: "Vir je jen menší buňka než bakterie", why: `Vir není malá bakterie ani žádná jiná buňka. ${NEMA_BUNKU}` },
      { value: "Vir má buněčnou stěnu, bakterie ne", why: `Je to naopak: buněčnou stěnu má bakterie. ${NEMA_BUNKU}` },
    ],
    hints: [
      "Bakterie je jedna buňka. Zamysli se, jestli je buňkou i vir.",
      "Bakterie má buněčnou stěnu, cytoplazmu i dědičnou informaci volně v buňce, jen jádro nemá. Vir je jen obal s dědičnou informací. Která možnost tenhle rozdíl popisuje?",
    ],
    explanation: "Bakterie je jednobuněčný organismus (buňka bez jádra). Vir buňkou není: tvoří ho jen dědičná informace v bílkovinném obalu.",
  },
  {
    q: "Kde se vir může množit?",
    correct: "Jen uvnitř živé buňky hostitele",
    distractors: [
      { value: "Kdekoli v prachu, ve vodě nebo v půdě", why: `Vir nemá vlastní látkovou přeměnu. ${MIMO_BUNKU}` },
      { value: "Na klice dveří, dokud ji někdo neumyje", why: `Na klice může vir chvíli přetrvat a přenést se na ruce. ${MIMO_BUNKU}` },
      { value: "Volně v krvi, kde se sám dělí na dva", why: `Vir se nedělí jako bakterie. Nové viry pro něj vyrábí napadená buňka.` },
    ],
    hints: [
      "Vir nemá vlastní buňku. Kdo mu tedy vyrobí nové viry?",
      "Vir vnikne do buňky jiného organismu a donutí ji vyrábět jeho kopie. Bez takové buňky se nemnoží, ať je v prachu, na klice, nebo volně v krvi.",
    ],
    explanation: "Vir se množí jen uvnitř živé buňky hostitele: vpraví do ní svou dědičnou informaci a buňka pak vyrábí nové viry. Mimo buňku se nemnoží.",
  },
  {
    q: "Čím se dají viry pozorovat?",
    correct: "Elektronovým mikroskopem",
    distractors: [
      { value: "Školním světelným mikroskopem", why: "Světelný mikroskop ukáže buňky a větší bakterie. Běžné viry jsou mnohem menší, ukáže je jen elektronový mikroskop." },
      { value: "Silnou lupou za dobrého světla", why: "Lupa zvětší jen několikrát. Běžné viry jsou tak malé, že je ukáže jen elektronový mikroskop." },
      { value: "Pouhým okem jako povlak na misce", why: "Pouhým okem uvidíš nanejvýš kolonii bakterií nebo plíseň. Jednotlivé viry ukáže jen elektronový mikroskop." },
    ],
    hints: [
      "Viry jsou menší než bakterie. Stačí na ně přístroj, kterým ve škole pozoruješ buňky?",
      "Lupa i školní mikroskop pracují se světlem a tak malé věci neukážou. Vědci na viry potřebují přístroj, který místo světla používá paprsek drobných částic.",
    ],
    explanation: "Běžné viry jsou mnohem menší než bakterie, proto je světelný mikroskop ani lupa neukážou. Pozorovat je lze jen elektronovým mikroskopem.",
  },
  {
    q: "Která z těchto nemocí je virová?",
    correct: "Chřipka",
    distractors: [ANGINA, TETANUS, SALMONELOZA],
    hints: [
      "U každé nemoci si vzpomeň, jestli na ni lékař předepisuje antibiotika. Na virové nemoci nezabírají.",
      "Na virové nemoci antibiotika nezabírají. Hledáš nemoc, která se každou zimu šíří kapénkami a proti které se očkuje každý rok novou vakcínou.",
    ],
    explanation: "Chřipku způsobuje virus, šíří se kapénkami. Angínu, tetanus i salmonelózu způsobují bakterie.",
  },
  {
    q: "Kterou z těchto nemocí způsobuje vir?",
    correct: "Plané neštovice",
    distractors: [ANGINA, TUBERKULOZA, BORELIOZA],
    hints: [
      "U každé možnosti si rozmysli, jestli ji způsobuje organismus s buňkou, nebo původce bez buňky.",
      "Hledáš nemoc hlavně malých dětí, při které po celém těle naskočí svědivé puchýřky.",
    ],
    explanation: "Plané neštovice jsou virová nemoc, šíří se vzduchem a obsahem puchýřků. Angína, tuberkulóza i borelióza jsou bakteriální.",
  },
  {
    q: "Která nemoc z nabídky patří mezi virová onemocnění?",
    correct: "Spalničky",
    distractors: [TETANUS, TUBERKULOZA, SALMONELOZA],
    hints: [
      "Virové nemoci se antibiotiky neléčí, ale proti mnoha z nich se očkuje. Projdi nabídku s touto myšlenkou.",
      "Hledáš velmi nakažlivou nemoc s horečkou a vyrážkou po celém těle, proti které se očkují už malé děti. Antibiotika na ni nezabírají.",
    ],
    explanation: "Spalničky způsobuje virus a patří k nejnakažlivějším nemocem, proto se proti nim očkuje. Tetanus, tuberkulóza a salmonelóza jsou bakteriální.",
  },
  {
    q: "Kterou nemoc z nabídky nezpůsobuje bakterie, ale vir?",
    correct: "Příušnice",
    distractors: [ANGINA, SALMONELOZA, TETANUS],
    hints: [
      "Postupuj vylučováním: u každé nemoci si vybav, jestli ji lékař léčí lékem proti bakteriím.",
      "Hledáš virovou nemoc, při které zduří slinné žlázy, takže oteče tvář a krk. Očkuje se proti ní spolu se spalničkami.",
    ],
    explanation: "Příušnice jsou virová nemoc, při které zduří příušní slinné žlázy. Angínu, salmonelózu a tetanus způsobují bakterie.",
  },
  {
    q: "Kterou z nabízených nemocí vyvolává vir?",
    correct: "Klíšťová encefalitida",
    distractors: [BORELIOZA, ANGINA, SALMONELOZA],
    hints: [
      "Pozor na nemoci, které přenáší totéž zvíře: přenašeč ještě neurčuje, jestli je původce vir, nebo bakterie.",
      "Klíště přenáší dvě známé nemoci. Jednu způsobuje bakterie a léčí se antibiotiky, druhou vir, který napadá mozek, a proti ní se očkuje. Hledáš tu druhou.",
    ],
    explanation: "Klíšťovou encefalitidu způsobuje virus, proto se proti ní očkuje. Borelióza, kterou klíště přenáší také, je bakteriální, stejně jako angína a salmonelóza.",
  },
  {
    q: "Která z uvedených nemocí je virová, a ne bakteriální?",
    correct: "Vzteklina",
    distractors: [TETANUS, BORELIOZA, TUBERKULOZA],
    hints: [
      "Ke každé nemoci v nabídce si vybav jejího původce: je to bakterie, nebo vir?",
      "Hledáš nemoc, kterou přenáší kousnutí nakaženého zvířete, třeba lišky nebo psa. Když propukne, končí téměř vždy smrtí, proto se hned po kousnutí očkuje.",
    ],
    explanation: "Vzteklinu způsobuje virus a přenáší se kousnutím nakaženým zvířetem. Tetanus, borelióza i tuberkulóza jsou bakteriální nemoci.",
  },
  {
    q: "Co z nabídky je virové onemocnění?",
    correct: "Zarděnky",
    distractors: [SALMONELOZA, ANGINA, TUBERKULOZA],
    hints: [
      "Projdi možnosti jednu po druhé a zeptej se: pomůže na tuhle nemoc antibiotikum? Pokud ne, je nejspíš virová.",
      "Hledáš nemoc s drobnou růžovou vyrážkou. Pro těhotné ženy je nebezpečná, protože může poškodit nenarozené dítě. Očkuje se proti ní spolu se spalničkami a příušnicemi.",
    ],
    explanation: "Zarděnky jsou virová nemoc s drobnou vyrážkou, proti které se očkuje. Salmonelóza, angína i tuberkulóza jsou bakteriální.",
  },
  {
    q: "Co dělá očkování v těle?",
    correct: "Naučí obranu těla poznat původce předem",
    distractors: [
      { value: "Zničí viry, které už v těle jsou", why: "Očkování nemoc neléčí. Připraví obranu těla dřív, než se člověk nakazí." },
      { value: "Funguje jako antibiotikum proti virům", why: `Očkovací látka není antibiotikum. ${ANTIBIOTIKA}` },
      { value: "Pročistí krev od všech bakterií", why: "Očkování nic nečistí a chrání jen proti té nemoci, proti které je určené." },
    ],
    hints: [
      "Očkuje se zdravý člověk, ještě než onemocní. K čemu mu to je?",
      "Očkovací látka obsahuje oslabeného nebo neškodného původce či jeho část. Tělo si ho zapamatuje, a když přijde skutečná nákaza, brání se rychleji.",
    ],
    explanation: "Očkování (vakcína) naučí obranný systém těla poznat původce nemoci dopředu. Při skutečné nákaze se tělo ubrání rychle. Už probíhající nemoc očkování neléčí.",
  },
  {
    q: "Které léky ničí bakterie, ale na viry nepůsobí?",
    correct: "Antibiotika",
    distractors: [
      { value: "Očkovací látky", why: "Očkovací látky bakterie neničí, jen předem připraví obranu těla, a to proti virovým i některým bakteriálním nemocem." },
      { value: "Léky proti horečce", why: "Léky proti horečce jen tlumí příznaky, bakterie neničí." },
      { value: "Kapky do nosu", why: "Kapky do nosu jen uvolní ucpaný nos, bakterie neničí." },
    ],
    hints: [
      "Hledáš léky, které předepíše lékař třeba na hnisavou angínu nebo na boreliózu.",
      "Jde o léky, které zasahují do stavby a činnosti bakteriální buňky. Vir buňku nemá, proto na něj nepůsobí. První takový lék se získal z plísně.",
    ],
    explanation: "Antibiotika ničí bakterie, protože působí na jejich buňku. Vir buňku nemá, proto na virové nemoci antibiotika nezabírají.",
  },
  {
    q: "Co platí pro všechny viry?",
    correct: "Množí se jen v živých buňkách",
    distractors: [
      { value: "Jsou to nejmenší bakterie", why: `Vir není bakterie. ${NEMA_BUNKU}` },
      { value: "Mají jádro a cytoplazmu", why: `Jádro ani cytoplazmu vir nemá. ${NEMA_BUNKU}` },
      { value: "Žijí volně v půdě a ve vodě", why: MIMO_BUNKU },
    ],
    hints: [
      "Vylučuj možnosti, které z viru dělají buňku nebo samostatný organismus.",
      "Vir nemá vlastní buňku, a nemůže tedy sám přijímat potravu ani se dělit. Na rozmnožování potřebuje někoho jiného.",
    ],
    explanation: "Všechny viry se množí jen uvnitř živých buněk hostitele. Nejsou to bakterie a nemají jádro ani cytoplazmu.",
  },
  {
    q: "Který z těchto útvarů nemá buněčnou stavbu?",
    correct: "Virus chřipky",
    distractors: [
      { value: "Bakterie salmonely", why: "Bakterie je buňka, jen nemá jádro." },
      { value: "Kvasinka z těsta", why: "Kvasinka je jednobuněčná houba, má buňku i s jádrem." },
      { value: "Trepka z tůňky", why: "Trepka je jednobuněčný prvok, má buňku s jádrem." },
    ],
    hints: [
      "Tři z útvarů jsou jednobuněčné organismy. Najdi ten, který buňkou vůbec není.",
      "Jednobuněčné jsou prvoci, kvasinky i bakterie. Útvar bez buňky tvoří jen obal s dědičnou informací a sám se nemnoží.",
    ],
    explanation: "Buněčnou stavbu nemají jen viry. Bakterie, kvasinka i trepka jsou jednobuněčné organismy.",
  },
  {
    q: "Co pomáhá předejít některým virovým nemocem ještě před nákazou?",
    correct: "Očkování",
    distractors: [
      { value: "Antibiotika na zásobu", why: `Antibiotika nechrání před nákazou a na viry nepůsobí. ${ANTIBIOTIKA}` },
      { value: "Sirup proti kašli", why: "Sirup jen tlumí kašel u nemocného. Nákaze nezabrání." },
      { value: "Studené obklady", why: "Obklady jen snižují horečku u nemocného. Nákaze nezabrání." },
    ],
    hints: [
      "Hledáš ochranu, kterou dostane zdravý člověk, ne lék pro nemocného.",
      "Sirup a obklady jen ulevují nemocnému. Chránit dopředu umí jen to, co tělo naučí poznat původce, třeba u spalniček nebo klíšťové encefalitidy.",
    ],
    explanation: "Proti řadě virových nemocí (spalničky, zarděnky, klíšťová encefalitida, chřipka) chrání očkování. Antibiotika na viry nepůsobí a sirup ani obklady nákaze nezabrání.",
  },
];

// ── L2 — POUŽITÍ: situace z běžného života ────────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Tomáš má chřipku a chce si vzít antibiotika, která zbyla doma v šuplíku. Co mu správně poradíš?",
    correct: "Ať je nebere, na viry antibiotika nezabírají",
    distractors: [
      { value: "Ať je vezme, antibiotika virus v těle zničí", why: ANTIBIOTIKA },
      { value: "Ať vezme aspoň půl dávky, na chřipku stačí", why: `Ani malá dávka na virus nepůsobí. ${ANTIBIOTIKA}` },
      { value: "Ať je vezme, až mu stoupne horečka", why: `Vysoká horečka neznamená, že antibiotika pomohou. ${ANTIBIOTIKA}` },
    ],
    hints: [
      "Rozmysli si, jestli chřipku způsobuje bakterie, nebo vir, a na co antibiotika působí.",
      "Antibiotika zasahují do bakteriální buňky. Chřipku způsobuje původce bez buňky. Nemocnému pomůže klid, pití a při zhoršení lékař, který rozhodne o léčbě.",
    ],
    explanation: "Chřipka je virová nemoc a antibiotika na viry nepůsobí. Brát je bez lékaře je navíc škodlivé. Tomášovi pomůže klid a pití, a když se stav zhorší, lékař.",
  },
  {
    q: "Eliška má rýmu. Jak se nejspíš nakazila?",
    correct: "Kapénkami od kýchajícího spolužáka",
    distractors: [
      { value: "Z nedovařeného vejce se salmonelou", why: "Z nedovařeného vejce hrozí salmonelóza, bakteriální nemoc trávení. Rýma se šíří kapénkami." },
      { value: "Přisátím klíštěte na zahradě", why: "Klíště přenáší boreliózu a klíšťovou encefalitidu. Rýma se šíří kapénkami." },
      { value: "Poraněním o rezavý hřebík", why: "Nečistá rána hrozí tetanem, bakteriální nemocí. Rýma se šíří kapénkami." },
    ],
    hints: [
      "Rýmu způsobují viry z nosu a krku nemocného. Jak se odtud dostanou k dalšímu člověku?",
      "Při kýchání a kašli vylétají drobné kapičky, ve kterých viry na chvíli přežijí. Ostatní možnosti patří k jiným nemocem: k zažívací, ke klíštěti a k ráně.",
    ],
    explanation: "Rýma je virová nemoc a šíří se kapénkovou nákazou: kapičky od kýchajícího nebo kašlajícího člověka vdechneme nebo se dostanou z rukou do nosu.",
  },
  {
    q: "Honza chodí často do lesa. Lékař u něj zjistil virový zánět mozku, proti kterému se lidé chodící do přírody očkují. Jak se nejspíš nakazil?",
    correct: "Přisátím nakaženého klíštěte",
    distractors: [
      { value: "Kapénkami od nemocného turisty", why: "Klíšťová encefalitida se mezi lidmi kapénkami nešíří. Virus přenáší klíště." },
      { value: "Dotykem kůry stromu v lese", why: `Na kůře se virus nemnoží. ${MIMO_BUNKU} Klíšťovou encefalitidu přenáší klíště.` },
      { value: "Škrábnutím o trnitý keř", why: "Škrábnutí virus nepřenese. Klíšťovou encefalitidu přenáší klíště." },
    ],
    hints: [
      "Porovnej cesty nákazy: kapénky se šíří od člověka k člověku, rána pustí do těla původce ze špíny nebo ze slin a někteří živočichové ho vpraví přímo do krve, když sají.",
      "Virus této nemoci žije v krvi drobných lesních živočichů a do člověka se dostane přes kůži, když se na ni přisaje malý lesní parazit.",
    ],
    explanation: "Klíšťovou encefalitidu způsobuje virus, který přenáší klíště při sání krve. Proto se proti ní lidé chodící do přírody očkují a chrání se dlouhým oblečením a repelentem.",
  },
  {
    q: "Filip čte, že vzteklina se šíří mezi divokými zvířaty. Jak se jí může nakazit člověk?",
    correct: "Kousnutím nakaženým zvířetem",
    distractors: [
      { value: "Kapénkami od kýchajícího souseda", why: "Kapénkami se šíří chřipka a rýma. Vzteklinu přenáší kousnutí nakaženým zvířetem." },
      { value: "Přisátím klíštěte v trávě", why: "Klíště přenáší boreliózu a klíšťovou encefalitidu. Vzteklinu přenáší kousnutí." },
      { value: "Snědením syrového vejce", why: "Ze syrového vejce hrozí salmonelóza. Vzteklinu přenáší kousnutí nakaženým zvířetem." },
    ],
    hints: [
      "Virus vztekliny je ve slinách nemocného zvířete. Jak se sliny dostanou do rány?",
      "Nemocné zvíře bývá neklidné a útočí. Virus z jeho tlamy se dostane do těla člověka nebo jiného zvířete přes poraněnou kůži.",
    ],
    explanation: "Vzteklinu způsobuje virus ve slinách nakaženého zvířete (liška, pes, netopýr). Člověk se nakazí kousnutím, proto musí hned k lékaři, který nasadí očkování.",
  },
  {
    q: "Lucie se ve škole učí o viru HIV. Jak se tento virus přenáší?",
    correct: "Krví nebo pohlavním stykem",
    distractors: [
      { value: "Podáním ruky nebo objetím", why: "Běžným dotykem se HIV nepřenáší. Přenáší se krví nebo pohlavním stykem." },
      { value: "Kapénkami při rozhovoru", why: "Kapénkami se šíří chřipka a rýma, HIV ne. Přenáší se krví nebo pohlavním stykem." },
      { value: "Pitím ze stejné skleničky", why: "Společnou skleničkou se HIV nepřenáší. Přenáší se krví nebo pohlavním stykem." },
    ],
    hints: [
      "HIV se nešíří vzduchem ani běžným dotykem. Kterými tělními tekutinami se tedy přenáší?",
      "Mimo tělo virus HIV rychle hyne. Přenáší se jen krví, spermatem nebo poševním sekretem, například při poranění jehlou od nakaženého. Sliny ani pot ho nepřenášejí.",
    ],
    explanation: "Virus HIV, který způsobuje nemoc AIDS, se přenáší krví (například společnou jehlou), pohlavním stykem a z nakažené matky na dítě. Podáním ruky, objetím, vzduchem ani společnou skleničkou se nepřenáší.",
  },
  {
    q: "Martinova sestra má rýmu. Co Martinovi nejlépe pomůže, aby se od ní nenakazil?",
    correct: "Časté mytí rukou mýdlem",
    distractors: [
      { value: "Užívání antibiotik předem", why: `Antibiotika nákaze nezabrání. ${ANTIBIOTIKA}` },
      { value: "Zavřená okna bez větrání", why: "Nevětraná místnost šíření kapének naopak pomáhá. Větrání a mytí rukou nákazu omezí." },
      { value: "Teplá čepice i doma", why: "Čepice před viry nechrání, rýmu nezpůsobuje chlad, ale virus." },
    ],
    hints: [
      "Viry se na chvíli usadí na předmětech a z nich na rukou. Jak se jich zbavíš?",
      "Martin sahá na kliky a ovladač, které držela i sestra, a pak si sahá na obličej. Pomůže tedy to, co viry z kůže odstraní dřív, než se dostanou do nosu.",
    ],
    explanation: "Viry rýmy se šíří kapénkami a přes ruce. Časté mytí rukou mýdlem a větrání nákazu omezí. Antibiotika na viry nepůsobí a teplo samo před nákazou nechrání.",
  },
  {
    q: "Klára musí kýchnout a nemá u sebe kapesník. Co má udělat?",
    correct: "Kýchnout do rukávu u lokte",
    distractors: [
      { value: "Kýchnout do dlaně a pokračovat", why: "Z dlaně se viry přenesou na kliky a na ruce ostatních." },
      { value: "Kýchnout volně před sebe", why: "Kapénky s viry doletí k lidem kolem. Tak se nákaza šíří nejsnáz." },
      { value: "Kýchnout a zakrýt si jen nos", why: "Kapénky vylétají z nosu i z úst. Zakrytý jen nos jejich šíření nezastaví." },
    ],
    hints: [
      "Kapénky při kýchání obsahují viry. Kam je zachytit, aby se nedostaly na ruce ani k ostatním?",
      "Ruce se dotýkají klik, zábradlí i spolužáků, takže kapénky na nich by se šířily dál. Najdi místo na těle, kterým na nic nesaháš.",
    ],
    explanation: "Kýchnutím do rukávu u lokte se kapénky zachytí na oblečení. Na rukou by se viry dostaly na předměty a k dalším lidem.",
  },
  {
    q: "Novákovi jezdí každé léto na chatu u lesa. Co je nejlépe ochrání před klíšťovou encefalitidou?",
    correct: "Očkování a dlouhé oblečení s repelentem",
    distractors: [
      { value: "Antibiotika užitá před odjezdem", why: `Encefalitidu způsobuje virus. ${ANTIBIOTIKA}` },
      { value: "Očkování proti tetanu před odjezdem", why: "Očkování proti tetanu chrání jen proti tetanu. Proti klíšťové encefalitidě je potřeba vlastní vakcína." },
      { value: "Mytí rukou před každým jídlem", why: "Mytí rukou pomáhá proti kapénkovým a střevním nemocem. Klíště se přisaje na kůži, tomu mytí rukou nezabrání." },
    ],
    hints: [
      "Rozmysli si, jak se tato nemoc přenáší a jestli ji způsobuje vir, nebo bakterie.",
      "Nemoc přenáší přisáté klíště a způsobuje ji vir, takže antibiotika nepomohou. Chránit může vakcína právě proti této nemoci a to, aby se klíště vůbec nepřisálo.",
    ],
    explanation: "Klíšťovou encefalitidu způsobuje virus, proti kterému existuje očkování. Virus přechází ze slin klíštěte do krve hned po přisátí, proto pomáhá dlouhé oblečení a repelent, aby se klíště vůbec nepřisálo. Prohlédnout kůži a klíště včas vytáhnout je také dobré, chrání to ale hlavně před boreliózou.",
  },
  {
    q: "Jakub se diví, že se očkuje proti klíšťové encefalitidě, ale proti borelióze ne. Jak to je?",
    correct: "Borelióza je bakteriální a vakcína na ni zatím není",
    distractors: [
      { value: "Borelióza je virová, ale velmi vzácná", why: BORELIOZA.why },
      { value: "Borelióza je neškodná a léčit se nemusí", why: "Borelióza může poškodit klouby i nervy. Léčí se antibiotiky, a proto je nutné jít k lékaři." },
      { value: "Encefalitida je bakteriální a vakcína bakterie zabije", why: "Klíšťovou encefalitidu způsobuje virus. Vakcína nikoho nezabíjí, jen naučí obranu těla poznat virus." },
    ],
    hints: [
      "Obě nemoci přenáší klíště. Liší se ale původcem. Který je který?",
      "Proti encefalitidě, kterou způsobuje vir, se chráníme vakcínou. Druhou nemoc způsobuje organismus s buňkou, a proto ji lékař léčí antibiotiky.",
    ],
    explanation: "Klíšťovou encefalitidu způsobuje virus a očkování proti ní existuje. Borelióza je bakteriální, vakcína proti ní zatím není, ale léčí se antibiotiky.",
  },
  {
    q: "Karolína leží doma s virózou. Které opatření jí nepomůže?",
    correct: "Antibiotika, ta na viry nepůsobí",
    distractors: [
      { value: "Klid na lůžku, ten šetří síly", why: "Klid pomáhá, tělo má víc sil na boj s virem." },
      { value: "Hodně pití, to doplní tekutiny", why: "Pití pomáhá, při horečce tělo ztrácí vodu." },
      { value: "Větrání, to ředí kapénky", why: "Větrání pomáhá, méně kapének ve vzduchu znamená menší riziko pro ostatní." },
    ],
    hints: [
      "Ptáš se na to, co nepomůže. U každé možnosti zvaž, jestli pomáhá tělu při viróze.",
      "Klid, pití i čerstvý vzduch podporují tělo, které se s virem pere samo. Hledej lék, který působí jen na původce s vlastní buňkou.",
    ],
    explanation: "Při viróze pomáhá klid, dostatek tekutin a větrání. Antibiotika na viry nepůsobí, proto je nemocný nemá brát sám, léčbu určí lékař.",
  },
  {
    q: "Ondra si všiml, že v zimě ve třídě onemocní chřipkou hodně dětí najednou. Proč se tam šíří tak snadno?",
    correct: "Mnoho lidí dýchá vzduch s kapénkami",
    distractors: [
      { value: "Viry se množí v lavicích a v prachu", why: MIMO_BUNKU },
      { value: "Chlad sám o sobě chřipku způsobuje", why: "Chřipku způsobuje virus, ne chlad. V zimě jsou lidé víc pohromadě v uzavřených místnostech." },
      { value: "Ve třídě se viry dělí rychleji", why: "Vir se nedělí. Nové viry vznikají jen uvnitř napadených buněk." },
    ],
    hints: [
      "Chřipka se šíří kapénkami. Co se v zimě ve třídě děje se vzduchem a s lidmi?",
      "V zimě se méně větrá a mnoho dětí sedí dlouho blízko sebe. Nemocný kašle a kýchá, ostatní vdechují tentýž vzduch.",
    ],
    explanation: "Chřipka se šíří kapénkami. Ve třídě je hodně lidí blízko sebe a v zimě se méně větrá, takže se kapénky snadno dostanou k ostatním. Virus se v lavicích ani v prachu nemnoží.",
  },
  {
    q: "Babička Věra jde na podzim k lékaři na očkování proti chřipce. K čemu jí bude?",
    correct: "Tělo se předem naučí virus poznat",
    distractors: [
      { value: "Očkování zničí viry, které už v těle má", why: "Očkování nemoc neléčí. Připraví obranu těla na budoucí nákazu." },
      { value: "Očkování jí nahradí antibiotika", why: `Očkovací látka není antibiotikum. ${ANTIBIOTIKA}` },
      { value: "Stejná vakcína ji chrání i před angínou", why: "Vakcína proti chřipce chrání jen před chřipkou. Hnisavou angínu způsobují bakterie." },
    ],
    hints: [
      "Babička se očkuje, když je zdravá, ještě před chřipkovou sezónou. Co tím získá?",
      "Vakcína obsahuje neškodné části viru. Obranný systém babičky si je zapamatuje a při skutečné nákaze zareaguje rychle. Chrání přitom jen před tou nemocí, pro kterou je určená.",
    ],
    explanation: "Očkování naučí obranu těla poznat virus chřipky dopředu, takže babička neonemocní nebo nemoc proběhne mírněji. Neléčí a nechrání před bakteriálními nemocemi.",
  },
  {
    q: "Anička přišla domů ze školy, kde bylo hodně nemocných dětí. Co udělá jako první?",
    correct: "Umyje si ruce teplou vodou a mýdlem",
    distractors: [
      { value: "Vezme si pro jistotu antibiotikum", why: `Antibiotikum nákaze nezabrání. ${ANTIBIOTIKA}` },
      { value: "Hned se nají a ruce umyje potom", why: "Při jídle se viry z rukou dostanou rovnou do úst. Ruce je potřeba umýt předem." },
      { value: "Otře si ruce suchým kapesníkem", why: "Otření nestačí. Viry z kůže spolehlivě odstraní až mýdlo a voda." },
    ],
    hints: [
      "Ve škole se Anička dotýkala věcí, na které kýchali nemocní. Kde teď viry nejspíš jsou?",
      "Viry na kůži se nemnoží, ale z prstů se snadno dostanou do úst nebo do nosu. Pomůže to, co je z kůže spolehlivě odstraní, a to dřív, než začne jíst.",
    ],
    explanation: "Viry se přenášejí i rukama. Důkladné mytí rukou mýdlem je odstraní dřív, než se dostanou do úst nebo do nosu. Antibiotika na viry nepůsobí.",
  },
  {
    q: "Terezu kousl netopýr, kterého našla na půdě. Co je správné udělat?",
    correct: "Jít hned k lékaři kvůli vzteklině",
    distractors: [
      { value: "Počkat, jestli se rána zanítí", why: "U vztekliny nelze čekat. Nemoc se rozvine až později, a pak už je nevyléčitelná. K lékaři je potřeba hned." },
      { value: "Ránu jen zalepit náplastí", why: "Náplast virus nezastaví. Po kousnutí divokým zvířetem je nutné jít hned k lékaři." },
      { value: "Vzít si doma antibiotika", why: `Vzteklinu způsobuje virus. ${ANTIBIOTIKA} Po kousnutí je nutný lékař a očkování.` },
    ],
    hints: [
      "Divoká zvířata mohou ve slinách přenášet nebezpečný virus. Kdo rozhodne, jestli je potřeba ochrana?",
      "Nemoc z kousnutí se projeví až po čase a pak ji už nelze vyléčit. Proto po kousnutí nepomůže čekat ani domácí léky, ale jen rychlé očkování, které nasadí odborník.",
    ],
    explanation: "Netopýři a jiná divoká zvířata mohou přenášet vzteklinu. Po kousnutí je nutné jít hned k lékaři, který rozhodne o očkování. Antibiotika na virus nepůsobí.",
  },
  {
    q: "Petra se ptá, proč se proti spalničkám očkují už malé děti. Co jí odpovíš?",
    correct: "Spalničky se snadno šíří kapénkami a antibiotika na ně nezabírají",
    distractors: [
      { value: "Spalničky jsou bakteriální a vakcína ty bakterie v těle zabije", why: "Spalničky způsobuje virus. Vakcína nic nezabíjí, jen naučí obranu těla poznat původce." },
      { value: "Spalničky se šíří jen jídlem, a proto se očkuje co nejdřív", why: "Spalničky se šíří kapénkami, ne jídlem. Jsou velmi nakažlivé." },
      { value: "Spalničky přenáší klíště a malé děti si hrají v trávě", why: "Klíště přenáší boreliózu a klíšťovou encefalitidu. Spalničky se šíří kapénkami." },
    ],
    hints: [
      "Zamysli se, jak se spalničky šíří a co je způsobuje.",
      "Spalničky jsou jedna z nejnakažlivějších nemocí a způsobuje je původce bez buňky. Když lék na nemoc nepůsobí, zbývá jediná ochrana: připravit tělo předem.",
    ],
    explanation: "Spalničky způsobuje virus, který se velmi snadno šíří kapénkami, a antibiotika na něj nepůsobí. Nejlepší ochranou je proto očkování už v dětství.",
  },
];

// ── L3 — ANALÝZA A PŘENOS: neznámý případ, znak → důsledek ─────────────────
export const POOL_L3: Polozka[] = [
  {
    q: "Vědci objevili útvar, který se množí jen uvnitř buněk listů tabáku, projde filtrem, na kterém se bakterie zachytí, a ukáže ho až elektronový mikroskop. Co to nejspíš je?",
    correct: "Neznámý virus",
    distractors: [
      { value: "Velmi drobná bakterie", why: "Bakterie je buňka, filtr ji zachytí a je vidět i světelným mikroskopem. Útvar, který se množí jen v cizích buňkách a projde filtrem, je vir." },
      { value: "Jednobuněčná řasa", why: "Řasa je buňka, množí se sama a filtr ji zachytí. Popis odpovídá viru." },
      { value: "Výtrus plísně", why: "Výtrus je buňka, ze které vyroste plíseň sama, a filtr ho zachytí. Popis odpovídá viru." },
    ],
    hints: [
      "Projdi znaky jeden po druhém: kde se útvar množí, jak je velký a čím ho lze vidět.",
      "Řasa, výtrus i bakterie jsou buňky, množí se samy a filtr pro bakterie je zachytí. Který útvar se bez cizí buňky nerozmnoží a je menší než bakterie?",
    ],
    explanation: "Všechny znaky ukazují na vir: množí se jen v živých buňkách hostitele, je tak malý, že projde filtrem pro bakterie, a ukáže ho až elektronový mikroskop. Z toho plyne, že nemá vlastní buňku. Tak byl ostatně objeven virus mozaiky tabáku.",
  },
  {
    q: "Proč antibiotika na viry nepůsobí?",
    correct: "Protože vir nemá vlastní buňku ani látkovou přeměnu",
    distractors: [
      { value: "Protože viry jsou odolné bakterie s pevnou stěnou", why: `Vir není bakterie. ${NEMA_BUNKU}` },
      { value: "Protože se na viry musí brát déle a ve větší dávce", why: "Ani delší, ani větší dávka na vir nepůsobí. Antibiotika zasahují do buňky bakterie a vir buňku nemá." },
      { value: "Protože viry žijí mimo tělo, kam lék nedosáhne", why: `Virus škodí právě uvnitř těla, v jeho buňkách. ${MIMO_BUNKU}` },
    ],
    hints: [
      "Antibiotika působí na něco, co bakterie má. Má to i vir?",
      "Antibiotika poškozují buněčnou stěnu bakterie nebo děje, které v její buňce probíhají. Porovnej to se stavbou viru a hledej možnost, která ten rozdíl pojmenuje.",
    ],
    explanation: "Antibiotika působí na bakteriální buňku (její stěnu nebo látkovou přeměnu). Vir nemá vlastní buňku ani látkovou přeměnu, všechno za něj dělá napadená buňka, a proto na něj antibiotika nemají kde zapůsobit.",
  },
  {
    q: "Proč se očkování proti chřipce musí opakovat každý rok?",
    correct: "Protože se virus chřipky stále mění",
    distractors: [
      { value: "Protože vakcína virus v těle zabije a vyprchá", why: "Vakcína viry nezabíjí, učí obranu těla je poznat." },
      { value: "Protože chřipku každý rok způsobuje jiná bakterie", why: "Chřipku způsobuje virus, ne bakterie." },
      { value: "Protože vakcína je antibiotikum a tělo si na ni zvykne", why: `Vakcína není antibiotikum. ${ANTIBIOTIKA}` },
    ],
    hints: [
      "Tělo si pamatuje původce, se kterým se už setkalo. Co když se původce změní?",
      "Obrana těla pozná jen tu podobu viru, kterou zná z vakcíny. Když virus změní svůj povrch, obrana ho nepozná, a vakcína se proto musí připravit znovu.",
    ],
    explanation: "Virus chřipky se neustále mění. Obrana těla naučená loňskou vakcínou nový virus nemusí poznat, proto se každý rok vyrábí vakcína nová.",
  },
  {
    q: "Proč se vir mimo živou buňku nemnoží?",
    correct: "Protože k množení potřebuje cizí buňku",
    distractors: [
      { value: "Protože mimo tělo je mu vždy příliš zima", why: "Teplota rozhodující není. Vir se nemnoží, protože nemá vlastní buňku." },
      { value: "Protože se umí dělit jen v krvi", why: "Vir se nedělí nikde. Nové viry pro něj vyrábí napadená buňka." },
      { value: "Protože v prachu nemá dost potravy", why: "Vir nepřijímá potravu, nemá látkovou přeměnu. Množí se jen v cizí buňce." },
    ],
    hints: [
      "Vzpomeň si, co vir obsahuje a co mu chybí oproti buňce.",
      "Vir nese jen návod na výrobu nových virů, ale sám nemá čím je vyrobit. Když nemá k dispozici živého hostitele, nové viry nevzniknou.",
    ],
    explanation: "Vir nemá vlastní buňku ani látkovou přeměnu. Nové viry pro něj vyrábí napadená živá buňka podle jeho dědičné informace. Mimo buňku jen chvíli přetrvá.",
  },
  {
    q: "Vědci objevili útvar bez buněčné stavby, který pronikne do bakterie, namnoží se v ní a bakterie pak praskne. Co to je?",
    correct: "Bakteriofág",
    distractors: [
      { value: "Antibiotikum", why: "Antibiotikum je látka, sama se nemnoží. Útvar, který se množí uvnitř bakterie, je vir – bakteriofág." },
      { value: "Trepka", why: "Trepka je prvok s vlastní buňkou. Bakterie pohlcuje jako potravu, ale nemnoží se v nich. Útvar bez buňky, který se množí v bakterii, je vir – bakteriofág." },
      { value: "Bílá krvinka", why: "Bílá krvinka bakterie pohlcuje, ale nemnoží se v nich. Takhle se chová vir – bakteriofág." },
    ],
    hints: [
      "Útvar se množí uvnitř cizí buňky. Která skupina se takhle množí vždycky?",
      "Který z útvarů v nabídce se neumí množit sám a potřebuje k tomu cizí buňku? Viry napadají i bakterie.",
    ],
    explanation: "Útvar, který se množí jen uvnitř bakterie a zničí ji, je vir napadající bakterie – bakteriofág. Vědci zkoumají, jak je využít proti nebezpečným bakteriím.",
  },
  {
    q: "Podle popisu mají listy tabáku světlé a tmavé skvrny jako mozaiku. Nemoc se přenáší šťávou z nemocných listů, šťáva zůstane nakažlivá i po průchodu filtrem pro bakterie a původce ukáže až elektronový mikroskop. Co ji způsobuje?",
    correct: "Virus napadající rostliny",
    distractors: [
      { value: "Nedostatek vody v půdě", why: "Nedostatek vody se nepřenáší šťávou na další rostliny. Tak malý přenosný původce je virus." },
      { value: "Bakterie žijící v půdě", why: "Bakterie by filtr zachytil a jsou vidět i světelným mikroskopem. Tak malý původce je virus." },
      { value: "Plíseň na povrchu listů", why: "Plíseň je tvořena buňkami, roste na povrchu a filtr by ji zachytil. Tak malý původce je virus." },
    ],
    hints: [
      "Nemoc je přenosná a její původce projde filtrem pro bakterie. Který původce z nabídky je tak malý?",
      "Bakterie i plíseň by filtr zachytil a nedostatek vody se nepřenáší. Původce viditelný až elektronovým mikroskopem patří do skupiny, která napadá člověka, zvířata i rostliny.",
    ],
    explanation: "Mozaiku tabáku způsobuje virus: projde filtrem pro bakterie a ukáže ho až elektronový mikroskop. Viry nenapadají jen člověka a zvířata, ale i rostliny. Právě virus mozaiky tabáku byl první objevený virus.",
  },
  {
    q: "Vědci zkoušeli na neznámou nemoc antibiotika a vůbec nepomohla. Původce se množí jen uvnitř buněk nemocného a v elektronovém mikroskopu vypadá jako drobné částice. Co z toho nejspíš plyne?",
    correct: "Nemoc nejspíš způsobuje virus",
    distractors: [
      { value: "Nemoc nejspíš způsobuje bakterie", why: "Na bakteriální nemoc by antibiotika obvykle zabrala a bakterie je vidět i světelným mikroskopem." },
      { value: "Nemoc nejspíš způsobuje plíseň", why: "Na plíseň antibiotika také nepůsobí, ale plíseň tvoří buňky, které se množí samy a jsou vidět i světelným mikroskopem." },
      { value: "Nemoc vyžaduje vyšší dávku antibiotik", why: `Když antibiotika nezabírají a původce se chová jako vir, vyšší dávka nepomůže. ${ANTIBIOTIKA}` },
    ],
    hints: [
      "Spoj znaky: na co antibiotika nepůsobí a co se množí jen v cizích buňkách?",
      "Bakterie i plísně jsou buňky, množí se samy a jsou vidět i světelným mikroskopem. Najdi původce, který splňuje všechny znaky zároveň.",
    ],
    explanation: "Antibiotika nepomohla, původce se množí jen v cizích buňkách a je vidět až elektronovým mikroskopem. Všechno ukazuje na vir, který nemá vlastní buňku. Vyšší dávka antibiotik by nepomohla.",
  },
  {
    q: "Vědci podali pacientům s neznámou nemocí antibiotika a za pár dní se uzdravili. Původce pod mikroskopem vypadal jako buňka bez jádra. Co nemoc nejspíš způsobil?",
    correct: "Nějaká bakterie",
    distractors: [
      { value: "Nějaký virus", why: "Na viry antibiotika nepůsobí a vir nemá buňku. Buňka bez jádra, na kterou antibiotika zabrala, je bakterie." },
      { value: "Bakteriofág", why: "Bakteriofág je vir, nemá buňku a antibiotika na něj nepůsobí." },
      { value: "Kvasinka", why: "Kvasinka je houba, její buňka má jádro. Buňka bez jádra je bakterie." },
    ],
    hints: [
      "Dva znaky: antibiotika zabrala a původce je buňka bez jádra. Kdo z nabídky splňuje oba?",
      "Na viry antibiotika nepůsobí a buňku nemají. Houby mají buňky s jádrem. Zbývá skupina jednobuněčných organismů, jejichž buňka jádro nemá.",
    ],
    explanation: "Buňka bez jádra, na kterou zabrala antibiotika, je bakterie. Viry (i bakteriofágy) buňku nemají a antibiotika na ně nepůsobí. Kvasinka má jádro.",
  },
  {
    q: "Proč vir projde filtrem, který bakterie zachytí?",
    correct: "Protože je mnohem menší než bakterie",
    distractors: [
      { value: "Protože je to kapalina, ne částice", why: "Vir je částice: dědičná informace v bílkovinném obalu. Projde filtrem díky své velikosti." },
      { value: "Protože umí filtr rozpustit", why: "Vir nemá látkovou přeměnu a nic nerozpouští. Filtrem projde, protože je menší než bakterie." },
      { value: "Protože se protáhne jako měkká buňka", why: `Vir není buňka. ${NEMA_BUNKU} Filtrem projde díky velikosti.` },
    ],
    hints: [
      "Filtr propustí jen částice, které se vejdou do jeho otvorů. Co to říká o viru?",
      "Bakterie ještě uvidíš školním mikroskopem, viry až elektronovým. Z toho plyne, jak se liší velikostí, a to rozhoduje, co otvory filtru projde.",
    ],
    explanation: "Viry jsou mnohem menší než bakterie, proto projdou i velmi jemným filtrem, který bakterie zachytí. Proto je také ukáže jen elektronový mikroskop.",
  },
  {
    q: "Proč nemocný virózou nakazí ostatní, i když se virus mimo tělo nemnoží?",
    correct: "Protože virus chvíli vydrží v kapénkách a na rukou",
    distractors: [
      { value: "Protože se virus v kapénkách dál dělí a množí", why: MIMO_BUNKU },
      { value: "Protože se virus ve vzduchu změní na bakterii", why: "Vir se na bakterii nikdy nezmění. Je to úplně jiný útvar bez buňky." },
      { value: "Protože se virus rozmnoží v prachu na zemi", why: MIMO_BUNKU },
    ],
    hints: [
      "Aby se virus přenesl, nemusí se cestou množit. Stačí mu něco jiného.",
      "Nemnožit se neznamená hned zaniknout. Virus v kapičce nebo na kůži chvíli přežije, a když se dostane k dalšímu člověku, množí se až v jeho buňkách.",
    ],
    explanation: "Virus se mimo buňku nemnoží, ale chvíli vydrží v kapénkách, na rukou a na předmětech. Když se dostane do těla dalšího člověka, začne se množit v jeho buňkách.",
  },
  {
    q: "Podle popisu nemoc přenáší přisáté klíště, začíná horečkou a může poškodit mozek. Antibiotika na ni nepůsobí, ale proti nemoci se dá očkovat. O kterou nemoc jde?",
    correct: "Klíšťová encefalitida",
    distractors: [BORELIOZA, TETANUS, ANGINA],
    hints: [
      "Klíště přenáší více nemocí. Který znak z popisu rozhodne, že původce nemá buňku?",
      "Antibiotika nepůsobí a očkování existuje: původcem je tedy vir. Druhou nemoc od klíštěte způsobuje bakterie a léčí se antibiotiky, tu vyřaď.",
    ],
    explanation: "Klíště přenáší boreliózu i klíšťovou encefalitidu. Protože antibiotika nepůsobí a očkování existuje, jde o virovou klíšťovou encefalitidu. Borelióza je bakteriální a antibiotika na ni zabírají.",
  },
  {
    q: "Podle popisu se nemoc přenáší kousnutím nemocné lišky nebo psa, antibiotika na ni nepůsobí, a když propukne, končí téměř vždy smrtí, proto se hned po kousnutí očkuje. O kterou nemoc jde?",
    correct: "Vzteklina",
    distractors: [TETANUS, BORELIOZA, SALMONELOZA],
    hints: [
      "Porovnej popis s nabídkou: cesta nákazy a to, jestli pomáhají antibiotika.",
      "Nemoc se přenáší slinami nakaženého zvířete při kousnutí a antibiotika na ni nepůsobí. Co z toho plyne o jejím původci?",
    ],
    explanation: "Popis odpovídá vzteklině: virus ve slinách zvířete, nákaza kousnutím, antibiotika nepomohou, chrání jen rychlé očkování. Tetanus, borelióza i salmonelóza jsou bakteriální.",
  },
  {
    q: "Proč nemá smysl brát antibiotika „pro jistotu“ při rýmě?",
    correct: "Protože rýmu způsobují viry, na které nepůsobí",
    distractors: [
      { value: "Protože rýma je bakteriální a přejde sama", why: "Rýmu způsobují viry, ne bakterie." },
      { value: "Protože antibiotika zničí virus až za měsíc", why: ANTIBIOTIKA },
      { value: "Protože rýmu způsobuje jen chlad, žádný původce", why: "Chlad rýmu nezpůsobuje, způsobují ji viry, které se šíří kapénkami." },
    ],
    hints: [
      "Rozmysli si, jaký původce rýmu způsobuje a na co antibiotika působí.",
      "Rýma se šíří kapénkami od nemocných, takže nevzniká jen z chladu. Její původce nemá vlastní buňku, a tak na něj lék proti bakteriím nemá jak zapůsobit.",
    ],
    explanation: "Rýmu způsobují viry a antibiotika na viry nepůsobí. Brát je zbytečně je navíc škodlivé, protože se bakterie v těle mohou stát vůči antibiotikům odolnými. Léčbu vždy určuje lékař.",
  },
  {
    q: "Vědci popsali tři jednobuněčné organismy a jeden vir. Který popis patří viru?",
    correct: "Dědičná informace v bílkovinném obalu, bez buňky",
    distractors: [
      { value: "Jedna buňka bez jádra, množí se dělením", why: "To je popis bakterie. Vir buňku nemá a nedělí se." },
      { value: "Buňka s jádrem a zelenými chloroplasty", why: "To je popis jednobuněčné řasy. Vir buňku nemá." },
      { value: "Organismus z buňky s jádrem a brvami", why: "To je popis prvoka, třeba trepky. Vir buňku nemá." },
    ],
    hints: [
      "Tři popisy mluví o buňce. Který se od nich liší?",
      "Bakterie, řasa i prvok jsou buňky, liší se jen jádrem, chloroplasty nebo brvami. Hledáš popis, ve kterém žádná buňka není, jen obal a to, co je uvnitř.",
    ],
    explanation: "Vir tvoří jen dědičná informace v bílkovinném obalu, nemá buněčnou stavbu. Ostatní popisy patří bakterii, jednobuněčné řase a prvokovi.",
  },
  {
    q: "Proč může vir napadnout i bakterii?",
    correct: "Protože i bakterie je živá buňka",
    distractors: [
      { value: "Protože vir je větší bakterie a menší sní", why: `Vir není bakterie a nic nejí. ${NEMA_BUNKU}` },
      { value: "Protože bakterie nemá dědičnou informaci", why: "Bakterie dědičnou informaci má, jen není uzavřená v jádře." },
      { value: "Protože bakterie je taky vir, jen větší", why: "Bakterie je buňka, vir buňku nemá. Jsou to různé útvary." },
    ],
    hints: [
      "Vir se může množit jen v jednom typu prostředí. Splňuje ho bakterie?",
      "Vir potřebuje hostitele, který má vlastní buňku a látkovou přeměnu. Porovnej s tím bakterii a hledej možnost, která to správně popisuje.",
    ],
    explanation: "Vir se množí v každé živé buňce, kterou umí napadnout, tedy i v bakterii. Viry napadající bakterie se jmenují bakteriofágy.",
  },
  {
    q: "Proč se nemocný s chřipkou nemá vracet do školy hned, jak mu klesne horečka?",
    correct: "Protože může ještě šířit viry na ostatní",
    distractors: [
      { value: "Protože se viry v lavici mezitím namnožily", why: `V lavici se viry nemnoží. ${MIMO_BUNKU} Důvodem je, že nemocný může viry ještě šířit.` },
      { value: "Protože ho musí doléčit antibiotika", why: `Chřipku způsobuje virus. ${ANTIBIOTIKA}` },
      { value: "Protože ho ve třídě nachladí průvan", why: "Chlad chřipku nezpůsobuje, způsobuje ji virus. Důvodem je, že nemocný může viry ještě šířit." },
    ],
    hints: [
      "Když horečka klesne, znamená to, že v těle už žádné viry nejsou?",
      "Napadené buňky ještě nějakou dobu vyrábějí nové viry a ty odcházejí s kapénkami při kašli a kýchání. Kdo je ve třídě blízko?",
    ],
    explanation: "Tělo se s virem pere ještě několik dní po poklesu horečky a nemocný přitom může viry kapénkami šířit dál. Proto má zůstat doma, dokud se nezotaví. Viry se v lavici nemnoží a antibiotika na ně nepůsobí.",
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
export const VIRY_STAVBA_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-pri-viry-stavba-vyznam-6",
    rvpNodeId: "g6-prirodopis-nebunecni-a-bakterie-viry-a-bakterie-viry-stavba-vyznam-virova-onemocneni",
    displayName: "Viry a virová onemocnění",
    title: "Viry - stavba, význam, virová onemocnění",
    studentTitle: "Viry – co to je a jak se bránit",
    subject: "prirodopis",
    category: "Nebuněční a bakterie",
    topic: "Viry a bakterie",
    briefDescription: "Poznáš stavbu viru, virové nemoci a proč na ně nezabírají antibiotika.",
    keywords: [
      "vir", "virus", "viry", "virová onemocnění", "dědičná informace", "bílkovinný obal",
      "chřipka", "rýma", "spalničky", "klíšťová encefalitida", "vzteklina", "HIV",
      "očkování", "antibiotika", "bakteriofág", "elektronový mikroskop",
    ],
    goals: [
      "Popsat stavbu viru a vysvětlit, proč nemá buněčnou stavbu.",
      "Rozlišit virové a bakteriální nemoci a určit, jak se virové nemoci šíří.",
      "Vysvětlit, proč na viry nepůsobí antibiotika a proč pomáhá očkování a hygiena.",
    ],
    boundaries: [
      "Jen fakta z běžných učebnic 6. ročníku, bez podrobné stavby virů a imunitního systému.",
      "Zdravotní rady jen bezpečné: při nemoci k lékaři, antibiotika nikdy sám na virózu.",
      "Latinské názvy a typy nukleových kyselin se nepoužívají.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vir nemá buněčnou stavbu: je to dědičná informace v bílkovinném obalu a množí se jen v živé buňce. Na viry nepůsobí antibiotika, chrání očkování a hygiena.",
      steps: [
        "Zjisti, jestli jde o útvar s buňkou (bakterie, prvok, houba), nebo bez buňky (vir).",
        "U nemoci si vzpomeň na původce a na to, jak se šíří (kapénky, klíště, kousnutí, krev).",
        "Rozhodni podle původce: na bakterie antibiotika, proti virům očkování a hygiena.",
      ],
      commonMistake: "Myslet si, že vir je jen malá bakterie, nebo že antibiotika vyléčí chřipku a rýmu.",
      example: "Chřipka je virová nemoc: šíří se kapénkami, antibiotika na ni nezabírají a chrání před ní očkování.",
    },
  },
];
