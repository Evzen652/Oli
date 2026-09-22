/**
 * Čeština 6. ročník — Pověst (regionální, historická) (select_one).
 *
 * Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts (znaky žánrů) a na
 * grade-5/cjl/elementarniLiterarniPojmyPriRozboruTextu.ts. L1 je rozcvička
 * na znaky pověsti (i vůči pohádce, bajce a báji), L2 přidává novou dovednost
 * — rozlišení pověsti místní (regionální) a historické — a L3 je analýza:
 * jádro pravdy × smyšlený prvek, účel pověsti a přenos dovednosti na nový
 * případ.
 *
 *  • L1 — znaky žánru: ukázka (pohádka/pověst/bajka/báje) → žánr; postava →
 *    žánr; fakta o autorech (Jirásek — Staré pověsti české; Ezop — bajky).
 *  • L2 — ukázka pověsti → místní, nebo historická (mezi čtyřmi nálepkami
 *    "místní pověst" / "historická pověst" / "pohádka" / "báje", aby šlo
 *    zúčtovat i s okolními žánry); u místní navíc "které slovo v textu to
 *    ukazuje" (klíč = jméno místa; distraktory: postava, kouzelný prvek,
 *    časové určení).
 *  • L3 — (a) jádro pravdy × smyšlený prvek (oběma směry); (b) k čemu
 *    pověst sloužila (ne převyprávění děje); (c) přenos — poznat, který
 *    příběh by mohl být místní pověstí, a co je třeba v pohádce změnit,
 *    aby z ní byla pověst.
 *
 * Chybový model (errorModel, viz zadání tématu):
 *  • kouzelný prvek (čert, drak, kouzelná hůl) žák bere jako důkaz pohádky,
 *    i když se ukázka váže ke jmenovanému místu nebo osobě;
 *  • slavné jméno nebo hrad bere automaticky jako historickou pověst, každé
 *    zmíněné místo bere jako místní pověst;
 *  • báje (bohové a mytičtí hrdinové, tady řečtí: Prométheus, Ikaros,
 *    Héraklés) považuje za pověst;
 *  • u jádra pravdy vybírá nejnápadnější fantastický prvek jako skutečný,
 *    nebo místo účelu pověsti převypráví děj.
 *
 * Determinismus: gen() nemá žádný stav mezi voláními — rotace pool[] se
 * počítá při každém volání znovu (viz src/test/generator-determinism.test.ts).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, ruzneUlohy, losUlohy, type Distractor } from "./_shared";

/**
 * buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme. `_shared` ke krátké
 * velké nápovědě připojuje „Dosaď každou možnost zpátky do věty…“, což u určování
 * žánru, druhu pověsti ani jádra pravdy nedává smysl (není kam dosazovat).
 * Velké nápovědy jsou proto psané celé a aspoň o pětinu delší než malé.
 */
function choice(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (t) t.hints = [...parts.hints];
  return t;
}

// ════════════════════════════════════════════════════════════════════════
// L1 (a) — žánr ukázky (pohádka / pověst / bajka / báje)
// ════════════════════════════════════════════════════════════════════════

type Zanr = "pohádka" | "pověst" | "bajka" | "báje";
const ZANRY: Zanr[] = ["pohádka", "pověst", "bajka", "báje"];

const ZANR_WHY: Record<string, string> = {
  "pověst>pohádka":
    "Pohádka je celá vymyšlená a nedrží se žádného skutečného místa ani osoby. Tahle ukázka se váže ke jmenovanému místu nebo osobě — a to pohádka nedělá, i kdyby v ní bylo kouzlo.",
  "pověst>bajka":
    "V ukázce nejednají zvířata jako lidé a nekončí ponaučením, jak to dělá bajka. Váže se ke jmenovanému místu nebo osobě.",
  "pověst>báje":
    "Báje vypráví o bozích a mytických hrdinech (třeba starých Řeků) nebo o vzniku světa. Tahle ukázka mluví o místě nebo osobě z naší krajiny a minulosti.",
  "pohádka>pověst":
    "Pověst by se vázala ke jmenovanému místu nebo osobě. Ukázka žádné takové jméno nemá, jen neurčitý vymyšlený svět.",
  "pohádka>bajka":
    "V ukázce nejednají zvířata jako lidé a nekončí ponaučením — to bajka mít musí.",
  "pohádka>báje":
    "V ukázce nevystupují bohové ani mytičtí hrdinové (třeba Zeus nebo Prométheus) a nevypráví o vzniku světa.",
  "bajka>pověst":
    "Pověst se váže ke jmenovanému místu nebo osobě, ne ke zvířatům s ponaučením.",
  "bajka>pohádka":
    "V pohádce nejde hlavně o ponaučení na konci, ale o kouzelný příběh v neurčitém vymyšleném světě.",
  "bajka>báje":
    "V ukázce nevystupují bohové ani mytičtí hrdinové — mluví o zvířatech s lidskými vlastnostmi.",
  "báje>pověst":
    "Pověst se váže ke jmenovanému místu z naší krajiny nebo k naší minulosti. Tady vystupují bohové a mytičtí hrdinové.",
  "báje>pohádka":
    "Pohádka nemá žádné jmenované bohy — hrdinové žijí v neurčitém vymyšleném světě. V ukázce ale vystupují konkrétní bohové a hrdinové starých Řeků.",
  "báje>bajka":
    "V ukázce nejednají zvířata jako lidé s ponaučením na konci — mluví se v ní o bozích a hrdinech.",
};

/** Zdůvodnění klíče podle žánru — PROČ, ne jen opakování klíče. */
const ZANR_PROC: Record<Zanr, string> = {
  pohádka:
    "Děj se odehrává v neurčitém vymyšleném světě („byl jednou“, „za horami“) a neváže se k žádnému skutečnému místu ani osobě — proto je to pohádka.",
  pověst:
    "Vyprávění se váže ke jmenovanému místu nebo osobě z naší krajiny či minulosti — proto je to pověst. Kouzelný prvek to nemění, pověst ho mít může.",
  bajka:
    "Jednají v ní zvířata s lidskými vlastnostmi a příběh vede k ponaučení — proto je to bajka.",
  báje:
    "Vypráví o bozích a mytických hrdinech (tady ze starověkého Řecka) — proto je to báje. Báje neboli mýty mají i jiné národy, třeba Seveřané nebo Egypťané.",
};

function zanrDistraktory(spravny: Zanr): Distractor[] {
  return ZANRY.filter((z) => z !== spravny).map((z) => ({ value: z, why: ZANR_WHY[`${spravny}>${z}`] }));
}

interface Ukazka {
  tema: string;
  text: string;
  zanr: Zanr;
  /** Jen u pověsti: jméno místa nebo osoby, ke kterému se ukázka váže. */
  jmeno?: string;
}

const UKAZKY: Ukazka[] = [
  // ── pohádka (vymyšlený svět, "byl jednou", "za horami") ──
  { tema: "chudý mlynář",
    text: "Za horami a za lesy žil chudý mlynář. Jeho syn dostal od stařenky kouzelný míšek plný zlaťáků.",
    zanr: "pohádka" },
  { tema: "král a tři dcery",
    text: "Byl jednou jeden král, který měl tři dcery. Nejmladší se nakonec provdala za začarovaného prince.",
    zanr: "pohádka" },
  { tema: "začarovaný les",
    text: "Byl jednou jeden začarovaný les, kde žila zlá čarodějnice, která uměla proměnit lidi ve zvířata.",
    zanr: "pohádka" },
  // ── bajka (mluvící zvířata jako lidé) ──
  { tema: "liška a hrozny",
    text: "Liška se dlouho snažila dosáhnout na hrozny, ale marně. Nakonec řekla, že jsou stejně kyselé.",
    zanr: "bajka" },
  { tema: "mravenec a cvrček",
    text: "Mravenec celé léto pracoval, zatímco cvrček jen zpíval. V zimě cvrček neměl co jíst.",
    zanr: "bajka" },
  { tema: "vrána a sýr",
    text: "Vrána držela v zobáku sýr. Liška jí lichotila, jak krásně zpívá, vrána otevřela zobák a sýr jí upadl.",
    zanr: "bajka" },
  // ── báje (bohové a mytičtí hrdinové) ──
  { tema: "Prométheus a oheň",
    text: "Prométheus přinesl lidem oheň, který ukradl bohům na hoře Olymp. Zeus ho za to potrestal.",
    zanr: "báje" },
  { tema: "Ikaros a křídla",
    text: "Ikaros si připevnil vosková křídla a vzlétl k obloze. Když přiletěl příliš blízko slunci, vosk se roztavil.",
    zanr: "báje" },
  { tema: "Héraklovy úkoly",
    text: "Héraklés musel splnit dvanáct téměř nesplnitelných úkolů, které mu uložil král Eurystheus.",
    zanr: "báje" },
  // ── pověst (jmenované místo nebo osoba) ──
  { tema: "Čertova stěna",
    text: "Čertovu stěnu u Vyššího Brodu prý navršil čert z balvanů, aby zatopil klášter.",
    zanr: "pověst", jmeno: "Čertova stěna u Vyššího Brodu" },
  { tema: "Přemysl a Libuše",
    text: "Kníže Přemysl prý pocházel z vesnice Stadice. Na Vyšehrad ho přivedli poslové kněžny Libuše.",
    zanr: "pověst", jmeno: "Stadice, Vyšehrad, kníže Přemysl, kněžna Libuše" },
  { tema: "Hladová zeď",
    text: "Hladovou zeď na Petříně dal prý postavit Karel IV., aby chudí lidé měli práci.",
    zanr: "pověst", jmeno: "Hladová zeď na Petříně, Karel IV." },
  { tema: "Blaničtí rytíři",
    text: "Blaničtí rytíři prý spí v hoře Blaník a přijdou zemi na pomoc v nejhorší chvíli.",
    zanr: "pověst", jmeno: "hora Blaník" },
  { tema: "praotec Čech",
    text: "Praotec Čech přivedl svůj lid na horu Říp a rozhodl se tam usadit.",
    zanr: "pověst", jmeno: "hora Říp" },
  { tema: "mistr Hanuš",
    text: "Pražský orloj prý sestrojil mistr Hanuš. Konšelé ho dali oslepit, aby stejný orloj nepostavil jinde.",
    zanr: "pověst", jmeno: "Pražský orloj" },
];

function ukolZanr(u: Ukazka): PracticeTask | null {
  return choice(
    `Přečti si text: „${u.text}“ Který žánr to je?`,
    u.zanr,
    zanrDistraktory(u.zanr),
    {
      hints: [
        "Podívej se, jestli v ukázce mluví zvířata jako lidé, jestli v ní vystupují bohové, nebo jestli se váže ke jménu skutečného místa či osoby.",
        "Zvířata s ponaučením patří k jednomu druhu vyprávění. Příběhy o bozích a mytických hrdinech (třeba starých Řeků) patří k jinému. Vymyšlený neurčitý svět („za horami“, „byl jednou“) patří k dalšímu — a jmenované skutečné místo nebo osoba k poslednímu.",
      ],
      explanation: ZANR_PROC[u.zanr],
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L1 (b) — podle čeho poznáš pověst (jen na pověstních ukázkách)
// ════════════════════════════════════════════════════════════════════════

const ZNAK_POVEST = "váže se ke jmenovanému místu nebo osobě";
const ZNAK_DISTRAKTORY: Distractor[] = [
  { value: "začíná slovy „Bylo nebylo“", why: "Takhle začínají vymyšlené příběhy bez skutečného místa — pohádky. Tahle ukázka jmenuje konkrétní místo nebo osobu." },
  { value: "zvířata v ní mluví a na konci je ponaučení", why: "To je znak bajky. Tahle ukázka mluví o konkrétním místě nebo osobě, ne o zvířatech." },
  { value: "vystupují v ní bohové a mytičtí hrdinové", why: "Bohové a mytičtí hrdinové patří do báje. Tahle ukázka se váže k místu nebo osobě z naší krajiny a minulosti." },
];

function ukolZnakPovesti(u: Ukazka): PracticeTask | null {
  return choice(
    `Přečti si text: „${u.text}“ Podle čeho poznáš, že jde o pověst?`,
    ZNAK_POVEST,
    ZNAK_DISTRAKTORY,
    {
      hints: [
        "Poznáš to podle toho, čeho se ukázka drží — vymyšleného světa, zvířat, bohů, nebo něčeho, co doopravdy existuje.",
        "Ber možnosti jednu po druhé a u každé se zeptej, jestli na ukázku opravdu sedí: Začíná ukázka slovy „Bylo nebylo“? Mluví v ní zvířata jako lidé a končí ponaučením? Vystupují v ní bohové a mytičtí hrdinové starých Řeků? Tři možnosti takhle vyřadíš a zbude jediná, která na ukázku sedí.",
      ],
      explanation: `V ukázce najdeš konkrétní pojmenování: ${u.jmeno ?? "skutečné místo nebo osobu"}. Pověst se váže ke jmenovanému místu nebo osobě — proto jde o pověst, i kdyby v ní byl kouzelný prvek.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L1 (c) — postava → žánr
// ════════════════════════════════════════════════════════════════════════

interface Postava {
  jmeno: string;
  text: string;
  zanr: Zanr;
}

const POSTAVY: Postava[] = [
  { jmeno: "kněžna Libuše",
    text: "Kněžna Libuše je postava spjatá se založením Prahy a s výběrem knížete Přemysla.",
    zanr: "pověst" },
  { jmeno: "praotec Čech",
    text: "Praotec Čech vystoupil na horu Říp a ukázal svému lidu kraj, kde se usadili.",
    zanr: "pověst" },
  { jmeno: "rytíř Bruncvík",
    text: "Rytíř Bruncvík se vydal do světa pro lepší erb a přivedl si domů lva.",
    zanr: "pověst" },
  { jmeno: "Blaničtí rytíři",
    text: "Blaničtí rytíři prý spí v hoře a čekají, až je zem bude nejvíc potřebovat.",
    zanr: "pověst" },
  { jmeno: "Popelka",
    text: "Byla jednou jedna dívka jménem Popelka, která od kmotřičky dostala kouzelné šaty na cestu do zámku.",
    zanr: "pohádka" },
  { jmeno: "chytrý Honza",
    text: "Byl jednou jeden chytrý Honza, který od kouzelného dědečka dostal píšťalku přivolávající pomoc.",
    zanr: "pohádka" },
  { jmeno: "Prométheus",
    text: "Prométheus ukradl bohům na hoře Olymp oheň a daroval ho lidem.",
    zanr: "báje" },
  { jmeno: "mravenec a cvrček",
    text: "Mravenec celé léto pracuje, zatímco cvrček jen zpívá a nakonec v zimě hladoví.",
    zanr: "bajka" },
];

function ukolPostava(p: Postava): PracticeTask | null {
  return choice(
    `Přečti si text: „${p.text}“ Do kterého žánru tahle postava patří?`,
    p.zanr,
    zanrDistraktory(p.zanr),
    {
      hints: [
        `Zaměř se na to, co o postavě „${p.jmeno}“ víme: je úplně vymyšlená, je zvíře s ponaučením, je bůh nebo mytický hrdina, nebo je spojená se skutečným místem či minulostí?`,
        "Kouzelný předmět nebo nadpřirozená schopnost samy o sobě nerozhodují. Důležité je, jestli se postava váže ke jménu skutečného místa nebo k dávné minulosti naší země, k mluvícím zvířatům s ponaučením, nebo k bohům a hrdinům bájných příběhů (třeba starých Řeků).",
      ],
      explanation: `Postava „${p.jmeno}“: ${ZANR_PROC[p.zanr]}`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L1 (d) — fakta o autorech
// ════════════════════════════════════════════════════════════════════════

function ukolAutorPovesti(): PracticeTask | null {
  return choice(
    "Kdo sepsal knihu Staré pověsti české (o praotci Čechovi, Libuši, Bruncvíkovi a Blanických rytířích)?",
    "Alois Jirásek",
    [
      { value: "Karel Jaromír Erben", why: "Erben je známý hlavně jako sběratel lidových pohádek a jako autor básnické sbírky Kytice." },
      { value: "Božena Němcová", why: "Němcová je známá hlavně jako sběratelka a vypravěčka lidových pohádek." },
      { value: "Aisópos", why: "Aisópos byl starořecký vypravěč bajek, ne českých pověstí." },
    ],
    {
      hints: [
        "Hledej jméno českého spisovatele, který převyprávěl staré vyprávění o počátcích našeho národa.",
        "Erben a Němcová jsou známí hlavně jako sběratelé pohádek, řecký vypravěč vyprávěl bajky. Zbývá jméno spisovatele, který příběhy o praotci Čechovi a Libuši sepsal knižně.",
      ],
      explanation: "Staré pověsti české (o praotci Čechovi, Libuši, Bruncvíkovi, Blanických rytířích) sepsal Alois Jirásek. Erben a Němcová sbírali hlavně pohádky, Aisópos vyprávěl bajky.",
    },
  );
}

function ukolAutorBajek(): PracticeTask | null {
  return choice(
    "Kdo je známý jako starořecký vypravěč bajek o zvířatech?",
    "Aisópos",
    [
      { value: "Jean de La Fontaine", why: "La Fontaine bajky psal, ale byl to francouzský básník ze 17. století — starořecké bajky jen převyprávěl ve verších." },
      { value: "Ivan Andrejevič Krylov", why: "Krylov psal bajky v Rusku v 19. století, tedy o dva tisíce let později než ve starověkém Řecku." },
      { value: "Hans Christian Andersen", why: "Andersen je dánský autor pohádek (Malá mořská víla, Ošklivé káčátko), ne bajkař." },
    ],
    {
      hints: [
        "Všichni v nabídce jsou slavní vypravěči, ale tři z nich žili až v posledních staletích. Hledej toho, kdo žil ve starověku.",
        "Dva z autorů v nabídce psali bajky až v novověku (jeden ve Francii v 17. století, druhý v Rusku v 19. století) a jeden je známý jako autor pohádek. Zbývá jediné jméno vypravěče, který žil ve starověkém Řecku a jehož krátké příběhy o zvířatech s ponaučením se vyprávějí dodnes.",
      ],
      explanation: "Aisópos (česky často Ezop) byl starořecký vypravěč bajek o zvířatech s ponaučením — proto se bajkám dodnes říká ezopovské. La Fontaine a Krylov jsou bajkaři novověcí, Andersen psal pohádky.",
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (a) — místní × historická (proti sobě i proti pohádce a báji)
// ════════════════════════════════════════════════════════════════════════

type Druh = "místní pověst" | "historická pověst";
const DRUHY: (Druh | "pohádka" | "báje")[] = ["místní pověst", "historická pověst", "pohádka", "báje"];

const DRUH_WHY: Record<string, string> = {
  "místní pověst>historická pověst":
    "Ukázka nezmiňuje žádnou postavu ani událost z dějin, jen vysvětluje vznik nebo jméno místa.",
  "místní pověst>pohádka":
    "Ukázka se váže ke jménu konkrétního místa (najdeš ho i dnes) — pohádka je celá vymyšlená a žádné takové jméno nepotřebuje.",
  "místní pověst>báje":
    "Báje vypráví o bozích a mytických hrdinech nebo o vzniku světa, ne o místě z naší krajiny.",
  "historická pověst>místní pověst":
    "Ukázka nevysvětluje vznik ani jméno žádného místa, váže se k postavě nebo události z dějin.",
  "historická pověst>pohádka":
    "Ukázka se váže k postavám a událostem, které tradice řadí do našich dějin (dávná knížata, králové, vojevůdci) — pohádka má jen vymyšlené postavy v neurčitém světě.",
  "historická pověst>báje":
    "Báje vypráví o bozích a mytických hrdinech starých národů (Zeus, Prométheus). Tahle ukázka mluví o postavě nebo události, kterou naše tradice řadí do dějin naší země.",
};

function druhDistraktory(spravny: Druh): Distractor[] {
  return DRUHY.filter((d) => d !== spravny).map((d) => ({ value: d, why: DRUH_WHY[`${spravny}>${d}`] }));
}

/**
 * Možnosti L2b se nabízejí v 1. pádě (`postava`, `kouzelnyPrvek`), aby klíč
 * nebyl jediná možnost v základním tvaru — v ukázce samotné pak stojí ve
 * tvaru, který věta vyžaduje.
 */
interface MistniItem {
  tema: string;
  text: string;
  misto: string;
  postava: string;
  kouzelnyPrvek: string;
  casoveUrceni: string;
}

const MISTNI: MistniItem[] = [
  { tema: "Čertova skála",
    text: "Nad řekou se tyčí skála, které se říká Čertova skála. Prý ji za jedinou noc navršil čert z kamení, které nosil v kouzelném pytli.",
    misto: "Čertova skála", postava: "čert", kouzelnyPrvek: "kouzelný pytel", casoveUrceni: "za jedinou noc" },
  { tema: "Panenská studánka",
    text: "V lese u vesnice je studánka, které se říká Panenská studánka. Kdysi dávno v ní zmizela dívka, kterou si prý odnesl vodník do své podvodní říše.",
    misto: "Panenská studánka", postava: "vodník", kouzelnyPrvek: "podvodní říše", casoveUrceni: "kdysi dávno" },
  { tema: "Kamenný mnich",
    text: "U vsi Lipová stojí zvláštně tvarovaný balvan, kterému lidé říkají Kamenný mnich. Před staletími to prý byl mnich, který se posmíval chudým, a kouzelník ho za to proměnil kouzelnou holí v kámen.",
    misto: "Kamenný mnich", postava: "kouzelník", kouzelnyPrvek: "kouzelná hůl", casoveUrceni: "před staletími" },
  { tema: "jezírko Bezedné",
    text: "V lese za vsí leží malé jezírko, kterému se odedávna říká Bezedné. Kdysi do něj prý sjel vůz i s koňmi a nikdo ho už nenašel — proto se věří, že jezírko nemá dno. Bydlí v něm vodní víla, která tam ukrývá začarovaný poklad.",
    misto: "Bezedné", postava: "vodní víla", kouzelnyPrvek: "začarovaný poklad", casoveUrceni: "odedávna" },
  { tema: "Čertův mlýn",
    text: "Na kraji lesa stojí opuštěný mlýn, kterému se říká Čertův mlýn. Za jednu jedinou noc ho prý postavil čert, který si při stavbě pomáhal čertovským kladivem.",
    misto: "Čertův mlýn", postava: "čert", kouzelnyPrvek: "čertovské kladivo", casoveUrceni: "za jednu jedinou noc" },
  { tema: "Loupežnická jeskyně",
    text: "V blízkých skalách je jeskyně, které se říká Loupežnická jeskyně. Loupežník v ní prý kdysi ukryl poklad, který hlídal začarovaný drak.",
    misto: "Loupežnická jeskyně", postava: "loupežník", kouzelnyPrvek: "začarovaný drak", casoveUrceni: "kdysi" },
  { tema: "Obří kámen",
    text: "Na kopci nad vesnicí leží obrovský balvan zvaný Obří kámen. Kdysi dávno ho tam v hněvu hodil obr, který uměl kouzelnou silou přenášet skály.",
    misto: "Obří kámen", postava: "obr", kouzelnyPrvek: "kouzelná síla", casoveUrceni: "kdysi dávno" },
  { tema: "Skřítkův kámen",
    text: "Uprostřed louky stojí osamělý kámen, kterému se říká Skřítkův kámen. Dodnes pod ním prý skřítek hlídá zakopaný začarovaný poklad.",
    misto: "Skřítkův kámen", postava: "skřítek", kouzelnyPrvek: "začarovaný poklad", casoveUrceni: "dodnes" },
];

interface HistorickaItem {
  tema: string;
  text: string;
}

/**
 * Historické pověsti = dějinná (nebo tradicí do dějin řazená) postava/událost
 * + legendární prvek. Čistě dějepisné záznamy bez pověstního jádra sem nepatří.
 */
const HISTORICKA: HistorickaItem[] = [
  { tema: "Přemysl a Libuše",
    text: "Vypráví se, že si kněžna Libuše vybrala za manžela oráče Přemysla, kterého poslové našli s pluhem na poli. Přemysl se stal zakladatelem prvního českého knížecího rodu." },
  { tema: "kníže Václav",
    text: "Kníže Václav, kterého ve Staré Boleslavi zavraždil jeho bratr Boleslav, byl znám svou zbožností. Traduje se, že sám pěstoval obilí a vinnou révu a z jejich úrody připravoval chléb a víno ke mši." },
  { tema: "Karel IV. a most",
    text: "Traduje se, že Karel IV. nechal do malty na stavbu kamenného mostu přidávat vejce z celé země, aby byla stavba pevnější." },
  { tema: "rytíř Dalibor",
    text: "Rytíř Dalibor z Kozojed byl vězněn ve věži Pražského hradu. Prý se tam naučil hrát na housle tak krásně, že se lidé chodili pod věž poslouchat." },
  { tema: "Žižkův buben",
    text: "Jan Žižka byl slavný husitský vojevůdce. Vypráví se, že před smrtí nařídil, aby z jeho kůže udělali buben, jehož zvuk bude nepřátele děsit i po jeho smrti." },
  { tema: "Bivoj a kanec",
    text: "Silák Bivoj prý holýma rukama přemohl obrovského divokého kance a přinesl ho živého na Vyšehrad. Kněžna Kazi ho za tento čin obdivovala." },
  { tema: "Horymír a Šemík",
    text: "Traduje se, že vladyka Horymír z Neumětel unikl trestu smrti na svém koni Šemíkovi, který přeskočil hradby Vyšehradu. Kníže mu za statečnost odpustil." },
  { tema: "Oldřich a Božena",
    text: "Kníže Oldřich se prý vracel z lovu a u studánky uviděl krásnou pradlenu Boženu. Zalíbila se mu tak, že si ji vzal za ženu." },
];

/**
 * Nápovědy k L2a jsou pro místní i historickou variantu SHODNÉ — jinak by první
 * nápověda prozradila, která z obou nálepek platí (stačilo by si přečíst, co
 * v ukázce „není“). Učí metodu: dvě kontrolní otázky, ne hotový závěr.
 */
const DRUH_HINTS: [string, string] = [
  "Zkontroluj dvě věci zvlášť: vysvětluje text, proč se nějaké místo jmenuje právě tak? A vystupuje v něm kníže, král, rytíř nebo jiná osoba z dějin? Podle toho, na kterou z těch otázek odpovíš ano, poznáš druh.",
  "Obrat „kterému se říká“ nebo „zvaný“ u jména místa prozrazuje, že text vysvětluje, proč se místo jmenuje právě tak. Naopak jméno osoby nebo události, kterou znáš z dějepisu nebo ze Starých pověstí českých (kníže, král, husité, bitva), ukazuje vazbu na naše dějiny. Samotný název místa nerozhoduje — rozhoduje jen tehdy, když příběh vysvětluje, PROČ se místo tak jmenuje. Bohové ani neurčitý svět „za horami“ se v obou případech neobjevují, takže báji i pohádku můžeš vyřadit.",
];

function ukolDruhMistni(m: MistniItem): PracticeTask | null {
  return choice(
    `Přečti si text: „${m.text}“ Jaký druh vyprávění to je?`,
    "místní pověst",
    druhDistraktory("místní pověst"),
    {
      hints: [...DRUH_HINTS],
      explanation: "Ukázka vysvětluje vznik jména konkrétního místa a nezmiňuje žádnou historickou osobu ani událost — je to pověst místní (regionální).",
    },
  );
}

function ukolDruhHistoricka(h: HistorickaItem): PracticeTask | null {
  return choice(
    `Přečti si text: „${h.text}“ Jaký druh vyprávění to je?`,
    "historická pověst",
    druhDistraktory("historická pověst"),
    {
      hints: [...DRUH_HINTS],
      explanation: "Ukázka se váže k postavě nebo události, kterou tradice řadí do našich dějin, a přidává k ní legendární detail. Nevysvětluje vznik žádného místního jména — je to pověst historická.",
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (b) — které slovo v ukázce ukazuje, že jde o místní pověst
// ════════════════════════════════════════════════════════════════════════

function ukolSlovoMistni(m: MistniItem): PracticeTask | null {
  return choice(
    `Přečti si text: „${m.text}“ Které slovo nebo sousloví z ukázky ukazuje, že jde o místní pověst?`,
    m.misto,
    [
      { value: m.postava, why: "To je postava (nebo postavy) z příběhu, ne důvod, proč se pověst váže k místu. Pověst je místní podle jména místa, jehož vznik vysvětluje." },
      { value: m.kouzelnyPrvek, why: "To je jen smyšlený prvek příběhu — kouzelná věc, bytost nebo schopnost. Poznávacím znakem místní pověsti je jméno konkrétního místa." },
      { value: m.casoveUrceni, why: "Časové určení jen říká, kdy se to má stát — nerozhoduje o tom, jestli je pověst místní. Podstatné je jméno místa, jehož název pověst vysvětluje." },
    ],
    {
      hints: [
        "Hledej v textu jméno, které se dá najít i na mapě nebo na turistické tabuli — ne postavu, ne kouzelnou věc, ne časový údaj.",
        "Místní pověst poznáš podle toho, že vysvětluje, proč se nějaké místo jmenuje právě tak. Zkus u každé možnosti: dala by se napsat jako název na mapu nebo na rozcestník? Postava, kouzelná věc ani časový údaj na mapě nebývají.",
      ],
      explanation: `Ukázka vysvětluje jméno místa „${m.misto}“ — to je znak místní pověsti, ne postava, kouzelný prvek ani časové určení.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (a) — jádro pravdy × smyšlený prvek (oba směry)
// Všechny možnosti jsou vždy tvrzení, která v ukázce opravdu stojí.
// ════════════════════════════════════════════════════════════════════════

interface L3aNormal {
  tema: string;
  text: string;
  skutecny: string;
  smyslene: [string, string, string];
}

const L3A_NORMAL: L3aNormal[] = [
  { tema: "Zvíkov",
    text: "Hrad Zvíkov stojí na skále nad soutokem Vltavy a Otavy. Podle pověsti v něm žije rarášek, který v noci přesouvá nábytek, a kdo přespí ve věži Markomance, toho prý stihne neštěstí.",
    skutecny: "Hrad Zvíkov stojí nad soutokem Vltavy a Otavy.",
    smyslene: ["V hradu žije rarášek.", "Rarášek v noci přesouvá nábytek.", "Kdo přespí ve věži Markomance, toho stihne neštěstí."] },
  { tema: "kníže a ves",
    text: "Podle pověsti založil kníže na tomto místě ves, když se cestou zastavil u studánky. Vodu mu prý podala víla, jeho kůň promluvil lidským hlasem a ze studánky od té doby teče voda, která uzdraví každou nemoc.",
    skutecny: "Kníže na tomto místě založil ves.",
    smyslene: ["Knížeti podala vodu víla.", "Knížecí kůň promluvil lidským hlasem.", "Voda ze studánky uzdraví každou nemoc."] },
  { tema: "rytíři v hoře",
    text: "V hoře Blaník podle pověsti spí rytíři. Až bude zemi nejhůř, hora se otevře a rytíři vyjedou zemi na pomoc. Hora Blaník skutečně leží ve středních Čechách a je dodnes cílem výletů.",
    skutecny: "Hora Blaník leží ve středních Čechách.",
    smyslene: ["V hoře Blaník spí rytíři.", "Hora se otevře, až bude zemi nejhůř.", "Rytíři vyjedou zemi na pomoc."] },
  { tema: "obležení hradu",
    text: "Za husitských válek obléhalo nepřátelské vojsko hrad na kopci. Podle pověsti obráncům pomáhal neviditelný skřítek, šípy nepřátel se ve vzduchu zastavovaly a zásoby chleba ve sklepě se každé ráno samy doplnily.",
    skutecny: "Hrad na kopci obléhalo nepřátelské vojsko.",
    smyslene: ["Obráncům pomáhal neviditelný skřítek.", "Šípy nepřátel se ve vzduchu zastavovaly.", "Zásoby chleba se každé ráno samy doplnily."] },
];

interface L3aReverse {
  tema: string;
  text: string;
  smysleny: string;
  skutecne: [string, string, string];
}

const L3A_REVERSE: L3aReverse[] = [
  { tema: "Bruncvíkův meč",
    text: "Karlův most v Praze dal postavit Karel IV. a most stojí dodnes. Podle pověsti je v jednom z jeho pilířů zazděný kouzelný meč rytíře Bruncvíka. Až bude zemi nejhůř, meč se sám vysune a porazí všechny nepřátele.",
    smysleny: "Meč v pilíři se sám vysune a porazí nepřátele.",
    skutecne: ["Karlův most je v Praze.", "Most dal postavit Karel IV.", "Karlův most stojí dodnes."] },
  { tema: "Horymír a Šemík",
    text: "Vladyka Horymír z Neumětel byl podle pověsti odsouzen k smrti. Jeho kůň Šemík mu lidským hlasem poradil, ať na něj ještě jednou nasedne, a pak s ním přeskočil hradby Vyšehradu. Vyšehrad v Praze stojí dodnes na skále nad Vltavou a ves Neumětely najdeš u Berouna.",
    smysleny: "Kůň Šemík promluvil lidským hlasem.",
    skutecne: ["Vyšehrad je v Praze.", "Vyšehrad stojí na skále nad Vltavou.", "Ves Neumětely leží u Berouna."] },
  { tema: "Bruncvík a lev",
    text: "Rytíř Bruncvík se podle pověsti vydal do světa, aby získal pro českou zemi lepší erb. Cestou zachránil lva před devítihlavou saní, a proto má prý Česko ve znaku lva. Lev je ve státním znaku dodnes, najdeš ho i na českých mincích a socha Bruncvíka stojí na pilíři Karlova mostu.",
    smysleny: "Bruncvík zachránil lva před devítihlavou saní.",
    skutecne: ["Česko má ve státním znaku lva.", "Socha Bruncvíka stojí u Karlova mostu.", "Lev je i na českých mincích."] },
];

function ukolJadroNormal(n: L3aNormal): PracticeTask | null {
  return choice(
    `Přečti si text: „${n.text}“ Který prvek ukázky může být historicky nebo zeměpisně skutečný?`,
    n.skutecny,
    n.smyslene.map((s): Distractor => ({ value: s, why: "Tohle v ukázce stojí, ale je to nadpřirozený prvek, který k příběhu přidali vypravěči — takhle se to ve skutečnosti stát nemohlo." })),
    {
      hints: [
        "Projdi si ukázku větu po větě a u každého tvrzení se zeptej: mohlo se tohle opravdu stát?",
        "Kouzelné bytosti, zakleté postavy, věci, které se dějí samy od sebe, a nadpřirozené schopnosti se ve skutečnosti stát nemohou. Zbývá jediné tvrzení, které mluví o místě nebo o skutku, jaký se opravdu stát mohl — u některých takových tvrzení si to navíc ověříš na mapě nebo v dějepise.",
      ],
      explanation: `„${n.skutecny}“ je jádro pravdy: takhle se to opravdu stát mohlo. Ostatní tvrzení popisují nadpřirozené věci, které k příběhu přidali vypravěči.`,
    },
  );
}

function ukolJadroReverse(r: L3aReverse): PracticeTask | null {
  return choice(
    `Přečti si text: „${r.text}“ Který prvek ukázky je jistě smyšlený?`,
    r.smysleny,
    r.skutecne.map((s): Distractor => ({ value: s, why: "Tohle tvrzení v ukázce stojí a jde ověřit na mapě, na fotce nebo v dějinách — je to jádro pravdy, ne smyšlený prvek." })),
    {
      hints: [
        "Projdi si ukázku větu po větě a u každého tvrzení se zeptej: dalo by se tohle ověřit — na mapě, na fotce, v knize o dějinách?",
        "Tři z možností jdou ověřit — místo existuje, stavba stojí, znak si můžeš prohlédnout. Jedna možnost popisuje něco nadpřirozeného (kouzlo, nestvůru, mluvící zvíře), co se ve skutečnosti stát nemohlo.",
      ],
      explanation: `„${r.smysleny}“ je nadpřirozený prvek — takhle se to ve skutečnosti stát nemohlo, přidali ho vypravěči. Ostatní tvrzení se dají ověřit a tvoří jádro pravdy.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (b) — k čemu pověst sloužila (ne převyprávění děje)
// ════════════════════════════════════════════════════════════════════════

interface UcelItem {
  tema: string;
  text: string;
  ucel: string;
  d1: string;
  d2: string;
  d3: string;
  /** Vlastní zpětná vazba k d3, když obecná („nedá se zjistit“) nestačí. */
  d3why?: string;
}

/**
 * Tvary distraktorů se střídají („existenci…“ / „to, že…“ / „že…“ / „jak…“ /
 * „kolik…“), aby se stejná role nedala poznat podle začátku věty.
 */
const UCEL: UcelItem[] = [
  { tema: "Svatošské skály",
    text: "Nad řekou Ohří u Lokte stojí skupina skal, které se říká Svatošské skály. Podle pověsti tu zkameněl celý svatební průvod i s ženichem Janem Svatošem — potrestala ho vodní víla za to, že porušil svůj slib.",
    ucel: "proč se skalám nad Ohří říká Svatošské skály",
    d1: "jak svatebčané jeden po druhém zkameněli",
    d2: "že vodní víly opravdu umějí proměnit člověka v kámen",
    d3: "kolik svatebčanů v průvodu šlo" },
  { tema: "Kamenný mnich",
    text: "U vsi Lipová stojí zvláštně tvarovaný balvan, kterému lidé říkají Kamenný mnich. Před staletími to prý byl mnich, který se posmíval chudým, a kouzelník ho za to proměnil v kámen.",
    ucel: "vznik jména balvanu u vsi Lipová",
    d1: "posměch mnicha chudým lidem",
    d2: "existenci kouzelníků, kteří umějí proměnit člověka v kámen",
    d3: "to, že chudí lidé mají vždycky pravdu" },
  { tema: "Blaničtí rytíři",
    text: "Blaničtí rytíři podle pověsti spí v hoře Blaník a mají zemi přijít na pomoc, až jí bude nejhůř.",
    ucel: "naději, že v těžké chvíli přijde pomoc",
    d1: "spánek rytířů uvnitř hory Blaník",
    d2: "to, že v hoře Blaník dodnes doopravdy spí rytíři",
    d3: "že hora Blaník je nejvyšší hora v Čechách",
    d3why: "To se z ukázky nijak zjistit nedá — a navíc to není pravda, nejvyšší hora v Čechách je Sněžka." },
  { tema: "Horymír a Šemík",
    text: "Podle pověsti unikl vladyka Horymír z Neumětel trestu smrti na svém koni Šemíkovi, který přeskočil hradby Vyšehradu.",
    ucel: "věrného koně, který zachránil svého pána",
    d1: "skok koně Šemíka přes hradby Vyšehradu",
    d2: "existenci koní, kteří umějí přeskočit vysoké hradby",
    d3: "jak vysoké byly hradby Vyšehradu" },
  { tema: "Karel IV. a most",
    text: "Podle pověsti nechal Karel IV. do stavební malty na most přidávat vejce z celé země, aby byla stavba pevnější.",
    ucel: "pečlivost, se kterou se ke stavbě mostu přistupovalo",
    d1: "přidávání vajec z celé země do stavební malty",
    d2: "že vejce v maltě dělají stavbu úplně nezničitelnou",
    d3: "to, kolik vajec se na stavbu mostu nakonec použilo" },
  { tema: "Obří kámen",
    text: "Na kopci nad vesnicí leží obrovský balvan zvaný Obří kámen. Kdysi dávno ho tam v hněvu hodil obr, který bydlel v sousedním kraji.",
    ucel: "vznik neobvykle velkého balvanu na kopci",
    d1: "hod rozzlobeného obra kamenem přes celý kraj",
    d2: "to, že v sousedním kraji doopravdy žili obři",
    d3: "jak daleko obr s kamenem doletěl" },
];

function ukolUcel(u: UcelItem): PracticeTask | null {
  return choice(
    `Přečti si text: „${u.text}“ Co tahle pověst hlavně vysvětluje nebo připomíná?`,
    u.ucel,
    [
      { value: u.d1, why: "To je jen převyprávění děje, ne to, co pověst vysvětluje nebo k čemu sloužila." },
      { value: u.d2, why: "To je fantastický prvek z příběhu vydávaný za skutečnost — takhle to doopravdy nefunguje." },
      { value: u.d3, why: u.d3why ?? "To se z ukázky vůbec nedá zjistit — pověst o tom nic neříká." },
    ],
    {
      hints: [
        "Nehledej, co se v příběhu STALO, ale PROČ si ho lidé vlastně vyprávěli — co jim tím vyprávěním vysvětloval nebo připomínal.",
        "Vyřaď holé převyprávění děje, fantastický prvek vydávaný za fakt i tvrzení, o kterém ukázka vůbec nemluví. Zbude jediná možnost, která mluví o smyslu celého vyprávění, ne o tom, co se v něm odehrálo.",
      ],
      explanation: `Pověst hlavně vysvětluje nebo připomíná ${u.ucel} — nejde o pouhé převyprávění děje ani o fantastický prvek jako skutečnost.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (c1) — přenos: který příběh by mohl být místní pověstí z okolí školy
// ════════════════════════════════════════════════════════════════════════

interface PrenosItem {
  tema: string;
  /** Tvar pro „pověst o …“ (6. pád). */
  temaLok: string;
  spravny: string;
  pohadkovy: string;
  bajkovy: string;
  /** Osobní zážitek na TÉMŽE místě — bez vysvětlení jména. */
  vypravovaci: string;
}

const PRENOS: PrenosItem[] = [
  { tema: "les za školou", temaLok: "lese za školou",
    spravny: "Vyprávění o tom, proč se lesu za školou říká Pastýřův les: kdysi se v něm ztratil pastýř.",
    pohadkovy: "Vyprávění o princezně, která za devatero horami čekala na prince s kouzelným mečem.",
    bajkovy: "Vyprávění o lišce a čápovi, kteří si navzájem připravili hostinu, při které se ten druhý nenajedl.",
    vypravovaci: "Vyprávění o tom, jak jsem se loni v lese za školou ztratil a cestu hledal až do tmy." },
  { tema: "rybník za vsí", temaLok: "rybníku za vsí",
    spravny: "Vyprávění o tom, proč se rybníku za vsí říká Utopencův rybník: kdysi se v něm utopil sedlák.",
    pohadkovy: "Vyprávění o rybáři, který za sedmero horami vylovil zlatou rybku plnící tři přání.",
    bajkovy: "Vyprávění o mravenci a cvrčkovi, kteří se na podzim hádali o zásoby na celou zimu.",
    vypravovaci: "Vyprávění o tom, jak jsme se s kamarády minulou sobotu koupali v rybníku za vsí." },
  { tema: "kopec u hřiště", temaLok: "kopci u hřiště",
    spravny: "Vyprávění o tom, proč se kopci u hřiště říká Zvonková hora: kdysi se pod něj propadl kostel.",
    pohadkovy: "Vyprávění o pasáčkovi, který za devatero horami přemohl draka a získal půl království.",
    bajkovy: "Vyprávění o zajíci a želvě, kteří si dali závod o to, kdo z nich doběhne do cíle dřív.",
    vypravovaci: "Vyprávění o tom, jak jsem si minulý týden na kopci u hřiště zlomil ruku při jízdě na kole." },
  { tema: "starý dub na návsi", temaLok: "starém dubu na návsi",
    spravny: "Vyprávění o tom, proč se dubu na návsi říká Soudcovský dub: kdysi se pod ním konaly soudy.",
    pohadkovy: "Vyprávění o dívce, která od kmotřičky dostala kouzelné šaty, a tak mohla jet na zámek.",
    bajkovy: "Vyprávění o vráně a lišce, která vráně zalichotila, a ta otevřela zobák, až jí sýr upadl.",
    vypravovaci: "Vyprávění o tom, jak jsme si s bratrem loni pod starým dubem na návsi hráli celé prázdniny." },
];

function ukolPrenos(p: PrenosItem): PracticeTask | null {
  return choice(
    `Chceš vymyslet místní pověst z okolí své školy — o ${p.temaLok}. Který z těchto čtyř příběhů by takové pověsti odpovídal?`,
    p.spravny,
    [
      { value: p.pohadkovy, why: "Vymyšlený neurčitý svět bez jmenovaného skutečného místa patří do pohádky, ne do místní pověsti." },
      { value: p.bajkovy, why: "Zvířata jednající jako lidé s ponaučením patří do bajky, ne do místní pověsti." },
      { value: p.vypravovaci, why: "Místo je sice stejné, ale tohle je osobní zážitek vypravěče z nedávné doby — nevysvětluje, jak místo vzniklo ani proč se tak jmenuje." },
    ],
    {
      hints: [
        "Místní pověst se vždycky váže ke jmenovanému, skutečně existujícímu místu z okolí a vysvětluje, proč se tak jmenuje nebo jak vzniklo.",
        "Pozor, stejné místo se může objevit i ve vyprávění, které pověstí není. Vyřaď vymyšlený svět bez jména místa, mluvící zvířata s ponaučením a obyčejný osobní zážitek. Zbude vyprávění, které vysvětluje jméno místa a odehrává se v dávné minulosti.",
      ],
      explanation: "Místní pověst vysvětluje jméno konkrétního místa z okolí a vrací se do dávné minulosti („kdysi“). Osobní zážitek na stejném místě jméno nevysvětluje, pohádka a bajka se ke skutečnému místu nevážou.",
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (c2) — přenos: co změnit v pohádce, aby z ní byla pověst
// ════════════════════════════════════════════════════════════════════════

interface ZmenaItem {
  tema: string;
  text: string;
}

const ZMENA: ZmenaItem[] = [
  { tema: "kovář a trpaslík",
    text: "Za sedmero horami žil kovář, kterému trpaslík daroval kladivo, jež samo kulo podkovy." },
  { tema: "kouzelná jehla",
    text: "Byla jednou jedna chudá švadlenka, které kouzelná jehla sama šila šaty pro celé království." },
  { tema: "kouzelná píšťalka",
    text: "Byl jednou jeden chudý pasáček, kterému vodník daroval kouzelnou píšťalku přivolávající ryby." },
  { tema: "zlatá rybka",
    text: "Byl jednou jeden rybář, který za devatero horami vylovil zlatou rybku plnící tři přání." },
];

function ukolZmena(z: ZmenaItem): PracticeTask | null {
  return choice(
    `Přečti si text: „${z.text}“ Co je v tomhle příběhu třeba změnit, aby z něj byla pověst?`,
    "vázat děj ke skutečnému, pojmenovanému místu",
    [
      { value: "přidat do příběhu ještě jeden kouzelný prvek", why: "Kouzelný prvek už v příběhu je a pohádce nevadí — to není to, co ji odlišuje od pověsti." },
      { value: "prodloužit příběh o další dobrodružství", why: "Délka příběhu o tom, jestli jde o pohádku nebo pověst, vůbec nerozhoduje." },
      { value: "vyměnit hlavní postavu za jinou", why: "Výměna jedné vymyšlené postavy za jinou vymyšlenou postavu problém neřeší — pořád chybí vazba na skutečné místo." },
    ],
    {
      hints: [
        "Pohádka se od pověsti neliší tím, že by neměla kouzlo — kouzlo mívají obě. Čím se pověst musí vyznačovat navíc?",
        "Vzpomeň si, podle čeho jsi v předchozích úlohách poznal pověst: co v ní najdeš vždycky a co v téhle ukázce naopak chybí? Pak u každé možnosti zkontroluj, jestli by právě tuhle chybějící věc do příběhu doplnila.",
      ],
      explanation: "Pověst se od pohádky liší tím, že se váže ke skutečnému, pojmenovanému místu (kopci, studánce, skále) místo neurčitého „za horami“. Kouzelný prvek v ní klidně zůstat může.",
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// gen()
// ════════════════════════════════════════════════════════════════════════

/** Round-robin proložení několika seznamů (zbytek delších seznamů jde na konec). */
function prokladej<T>(...seznamy: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(...seznamy.map((s) => s.length));
  for (let i = 0; i < max; i++) for (const s of seznamy) if (i < s.length) out.push(s[i]);
  return out;
}

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const poolL1: (() => PracticeTask | null)[] = prokladej(
    UKAZKY.map((u) => () => ukolZanr(u)),
    POSTAVY.map((p) => () => ukolPostava(p)),
    UKAZKY.filter((u) => u.zanr === "pověst").map((u) => () => ukolZnakPovesti(u)),
    [() => ukolAutorPovesti(), () => ukolAutorBajek()],
  );
  // Posun o půlku banky: prokládání staví vedle sebe i-tý prvek každého
  // seznamu, takže bez posunu padne „jaký druh“ i „které slovo“ na TUTÉŽ
  // ukázku v jednom sezení (dřív dvojice L2-0/L2-2 a L2-3/L2-5).
  const posun = Math.floor(MISTNI.length / 2);
  const poolL2: (() => PracticeTask | null)[] = prokladej(
    MISTNI.map((m) => () => ukolDruhMistni(m)),
    HISTORICKA.map((h) => () => ukolDruhHistoricka(h)),
    MISTNI.map((_, i) => () => ukolSlovoMistni(MISTNI[(i + posun) % MISTNI.length])),
  );
  const poolL3: (() => PracticeTask | null)[] = prokladej(
    L3A_NORMAL.map((n) => () => ukolJadroNormal(n)),
    L3A_REVERSE.map((r) => () => ukolJadroReverse(r)),
    UCEL.map((u) => () => ukolUcel(u)),
    PRENOS.map((p) => () => ukolPrenos(p)),
    ZMENA.map((z) => () => ukolZmena(z)),
  );
  const pool = level <= 1 ? poolL1 : level === 2 ? poolL2 : poolL3;
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), pool.length, pool.length * 3);
}

// ════════════════════════════════════════════════════════════════════════
// Topic
// ════════════════════════════════════════════════════════════════════════

export const POVEST_REGIONALNI_HISTORICKA: TopicMetadata[] = [
  {
    id: "g6-cjl-povest-regionalni-historicka-6",
    rvpNodeId: "g6-cjl-literarni-vychova-lidova-slovesnost-povest-regionalni-historicka",
    displayName: "Pověst - místní a historická",
    title: "Pověst (regionální, historická)",
    studentTitle: "Pověsti místní a historické",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Lidová slovesnost",
    briefDescription: "Poznáš pověst, rozlišíš místní a historickou a najdeš v ní jádro pravdy.",
    keywords: [
      "pověst", "místní pověst", "regionální pověst", "historická pověst", "jádro pravdy",
      "pohádka", "bajka", "báje", "Alois Jirásek", "Staré pověsti české", "Blaničtí rytíři",
    ],
    goals: [
      "Rozpoznat pověst a odlišit ji od pohádky, bajky a báje.",
      "Rozlišit pověst místní (regionální) a historickou.",
      "Oddělit v ukázce jádro pravdy od smyšleného prvku a určit, k čemu pověst sloužila.",
    ],
    boundaries: [
      "Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts (znaky žánrů).",
      "Bez psaní vlastního textu — žák jen vybírá ze čtyř možností.",
      "Sporné hraniční případy (Karlovy Vary, Blaník jako místo i děj zároveň) se v klíči na rozlišení místní × historická nepoužívají.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Pověst se váže ke jmenovanému skutečnému místu nebo osobě (na rozdíl od pohádky v neurčitém světě, bajky se zvířaty i báje, která vypráví o bozích a mytických hrdinech, třeba starých Řeků). Místní pověst vysvětluje vznik nebo jméno místa, historická se váže k postavě nebo události, kterou tradice řadí do našich dějin. V pověsti odděl jádro pravdy (co je ověřitelné) od smyšleného prvku (co ověřit nejde).",
      steps: [
        "Nejdřív ověř žánr: jmenované skutečné místo nebo osoba = pověst (ne pohádka, bajka, ani báje).",
        "Pak rozliš druh: vysvětluje pověst jméno místa? → místní. Váže se k postavě nebo události z našich dějin? → historická.",
        "U analýzy odděl to, co jde ověřit (jádro pravdy), od fantastického prvku, který ověřit nejde (smyšlené).",
      ],
      commonMistake: "Kouzelný prvek (čert, drak, kouzelná hůl) se bere jako důkaz pohádky, i když se ukázka váže ke jmenovanému místu — pohádka i pověst mohou mít kouzlo, rozhoduje vazba na skutečné místo nebo osobu.",
      example: "„Skále nad řekou se říká Čertova skála, protože ji prý za noc navršil čert.“ = pověst místní (vysvětluje jméno místa). „Kníže Oldřich si podle pověsti vzal za ženu pradlenu Boženu, kterou potkal u studánky.“ = pověst historická (postava z našich dějin + legendární příběh).",
    },
  },
];
