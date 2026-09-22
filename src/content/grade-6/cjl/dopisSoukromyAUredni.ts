/**
 * Čeština 6. ročník — Dopis soukromý a úřední (select_one).
 *
 * Navazuje na grade-5/cjl/dopisUredniZadostTiskopisyPrihlaskaDotaznik.ts
 * (části úředního dopisu, tiskopisy) a grade-4/cjl/dopisPsaniSoukromehoDopisu.ts.
 * V 6. ročníku jde učivo dál: žák se rozhoduje o REJSTŘÍKU podle adresáta
 * a účelu a rozebírá CELÝ hotový dopis, ne jen jeho jednotlivé části.
 *
 *  • L1 — rozpoznání (rozcvička navazující na 5. ročník).
 *    (a) jeden řádek dopisu → která je to část (oslovení/úvod/jádro/závěr/
 *        pozdrav/podpis/věc/místo a datum/adresa adresáta); kde o části
 *        rozhoduje poloha v dopise (úvod, věc bez štítku), ukáže se celý dopis,
 *    (b) daný adresát → které ze čtyř oslovení nebo pozdravů mu patří.
 *  • L2 — použití: adresát a účel popsané 1–2 větami → vhodná formulace
 *    (úvodní věta, hlavní prosba, poděkování, rozloučení, řádek Věc).
 *    Distraktory jsou blízké omyly: tykání v jinak zdvořilé větě, zdvořilá
 *    věta, ze které není poznat, oč se žádá, strojená přeformálnost, a jen
 *    menšinově hrubě hovorové formulace.
 *  • L3 — analýza hotového (smyšleného) dopisu o 4–6 řádcích:
 *    (a) který řádek do dopisu nepatří, (b) která náležitost v úředním dopise
 *    chybí, (c) kterou opravou bude dopis v pořádku. Obě varianty vyžadují
 *    dva kroky: nejdřív poznat typ dopisu podle adresáta, pak najít chybu.
 *
 * Stavba úředního dopisu v ukázkách: místo a datum → věc → oslovení → text →
 * pozdrav → podpis. Za závěrečným pozdravem v úředním dopise („S pozdravem“,
 * „S úctou“) se čárka nepíše (ČSN 01 6910); u soukromého rozloučení
 * („Měj se hezky,“) ji záměrně ponecháváme — v soukromém dopise se toleruje.
 *
 * Nápovědy: `_shared.buildChoiceTask` k příliš krátké velké nápovědě
 * připojuje obecnou strategii „Dosaď každou možnost zpátky do věty…“, která
 * k úlohám o stavbě dopisu nesedí (není kam dosazovat). Proto tu obě
 * nápovědy píšeme celé sami a lokální `choice()` je převezme beze změny.
 *
 * Chybový model (viz spec):
 *  1) rejstřík podle vlastního zvyku místo podle adresáta — hovorová/
 *     familiární formulace nebo tykání v úředním dopise,
 *  2) opačný extrém — přehnaně úřední tón v soukromém dopise,
 *  3) záměna částí dopisu (oslovení×pozdrav, úvod×jádro, věc×oslovení,
 *     závěr×pozdrav),
 *  4) v úředním dopise přehlédnutá chybějící náležitost, nebo zdvořilá, ale
 *     neurčitá formulace, ze které není poznat, oč se žádá.
 *
 * Adresy ve všech ukázkách jsou smyšlené (žádný reálný kontakt).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, shuffle, type Distractor } from "./_shared";

/** buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme (bez obecného přívěsku). */
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

const letter = (lines: string[]) => lines.map((l) => `„${l}“`).join(" ");

// ── L1 (a) — jeden řádek → která část dopisu ────────────────────────────────

type Cast =
  | "oslovení"
  | "úvod"
  | "jádro"
  | "závěr"
  | "pozdrav"
  | "podpis"
  | "věc"
  | "místo a datum"
  | "adresa adresáta";

const HINT_RADEK = "Kde v dopise řádek stojí — nahoře, uprostřed, nebo dole? A co v dopise dělá?";

function radekTask(
  radek: string,
  spravna: Cast,
  distraktory: { cast: Cast; why: string }[],
  hint: string,
  explanation: string,
  kontext?: string[],
): PracticeTask | null {
  const otazka = kontext
    ? `Dopis: ${letter(kontext)} Řádek „${radek}“ je v tomto dopise…`
    : `Řádek „${radek}“ je v dopise…`;
  return choice(
    otazka,
    spravna,
    distraktory.map((d) => ({ value: d.cast, why: d.why })),
    { hints: [HINT_RADEK, hint], explanation },
  );
}

const FORMAT_A: (PracticeTask | null)[] = [
  radekTask("Žádost o uvolnění z vyučování", "věc", [
    { cast: "oslovení", why: "Oslovení je až následující řádek „Vážená paní ředitelko,“; tenhle řádek adresátku neoslovuje." },
    { cast: "úvod", why: "Úvod je souvislá věta za oslovením; tenhle řádek stojí nad oslovením a celou větou není." },
    { cast: "místo a datum", why: "Místo a datum je řádek nad ním „V Plzni dne 5. března 2026“; tenhle řádek neříká kdy a odkud, ale o čem dopis je." },
  ],
  "Všimni si, že řádek stojí nad oslovením a není to celá věta. Co adresát z tak krátkého řádku pozná dřív, než začne číst samotný text?",
  "Krátký řádek nad oslovením jen pojmenovává, čeho se dopis týká — proto je to věc. Často se před ni píše i označení „Věc:“.",
  ["V Plzni dne 5. března 2026", "Žádost o uvolnění z vyučování", "Vážená paní ředitelko,", "prosím o uvolnění dcery Kláry Černé z vyučování dne 12. března kvůli lékařskému vyšetření.", "S pozdravem", "Eva Černá"]),

  radekTask("Vážená paní ředitelko,", "oslovení", [
    { cast: "pozdrav", why: "Pozdrav stojí na konci dopisu a rozlučuje se, tenhle řádek je na začátku a oslovuje adresátku." },
    { cast: "věc", why: "Věc pojmenovává téma dopisu, tenhle řádek naopak přímo oslovuje adresátku." },
    { cast: "podpis", why: "Podpis je jméno pisatele na konci dopisu, ne oslovení adresátky na začátku." },
  ],
  "Obsahuje řádek nějaké sdělení? Komu je určen a co po takovém řádku s čárkou na konci v dopise hned následuje?",
  "Řádek osloví adresátku hned na začátku dopisu — proto je to oslovení."),

  radekTask("S pozdravem", "pozdrav", [
    { cast: "věc", why: "Věc je krátký název tématu nad oslovením; tenhle řádek stojí na konci dopisu a neříká, o čem dopis je." },
    { cast: "podpis", why: "Podpis je jméno pisatele, které stojí až pod touhle formulí." },
    { cast: "oslovení", why: "Oslovení stojí na začátku dopisu a osloví adresáta, ne na konci při loučení." },
  ],
  "Stojí řádek na začátku, nebo na konci dopisu? Sděluje adresátovi něco nového, nebo je to jen ustálená fráze, kterou se dopis končí?",
  "Tahle ustálená rozlučková formule stojí na konci dopisu — proto je to pozdrav."),

  radekTask("Předem děkuji za kladné vyřízení mé žádosti.", "závěr", [
    { cast: "pozdrav", why: "Pozdrav je krátká ustálená formule jako „S pozdravem“; tahle věta ještě něco sděluje — děkuje a prosí o vyřízení." },
    { cast: "jádro", why: "Jádro obsahuje hlavní prosbu dopisu; tahle věta ji na závěr už jen shrnuje poděkováním." },
    { cast: "podpis", why: "Podpis je jméno pisatele, ne celá věta." },
  ],
  "Přináší věta novou prosbu, nebo jen uzavírá to, co už v dopise zaznělo? A je to celá věta, nebo jen krátká ustálená fráze?",
  "Věta ještě sděluje poděkování a stojí těsně před pozdravem — proto je to závěr."),

  radekTask("Ahoj Ondro,", "oslovení", [
    { cast: "věc", why: "Věc je krátký název tématu, který se píše v úředním dopise; tenhle řádek žádné téma nepojmenovává, oslovuje kamaráda." },
    { cast: "podpis", why: "Podpis je jméno pisatele na konci dopisu; tady je jméno adresáta na začátku." },
    { cast: "jádro", why: "Jádro obsahuje hlavní sdělení dopisu, ne oslovení kamaráda na úvod." },
  ],
  "Komu je řádek určen a kde v dopise stojí? Nese nějakou zprávu, nebo adresáta jen jmenuje, než začne samotné psaní?",
  "Řádek osloví kamaráda jménem hned na začátku dopisu — proto je to oslovení."),

  radekTask("Měj se hezky,", "pozdrav", [
    { cast: "úvod", why: "Úvod stojí na začátku dopisu hned za oslovením; tenhle řádek se píše až na konci při loučení." },
    { cast: "oslovení", why: "Oslovení stojí na začátku dopisu, ne na konci při loučení." },
    { cast: "podpis", why: "Podpis je jméno pisatele, ne rozloučení." },
  ],
  "Kde v dopise by tenhle řádek stál? Říká kamarádovi něco nového, nebo je to jen krátká ustálená fráze, se kterou se odchází?",
  "Krátké ustálené rozloučení na konci dopisu — proto je to pozdrav."),

  radekTask("Jana Nováková", "podpis", [
    { cast: "oslovení", why: "Oslovení osloví adresáta na začátku dopisu, tenhle řádek je jméno pisatelky na konci." },
    { cast: "pozdrav", why: "Pozdrav je ustálená formule jako „S pozdravem“; samotné jméno pisatelky je podpis pod ní." },
    { cast: "adresa adresáta", why: "Adresa adresáta obsahuje ulici a město toho, komu dopis patří, ne jméno pisatelky." },
  ],
  "V řádku není žádné sloveso ani sdělení, jen jméno. Kdo v dopise píše své vlastní jméno a na kterém místě dopisu?",
  "Samotné jméno na konci dopisu potvrzuje, kdo dopis napsal — proto je to podpis."),

  radekTask("V Praze dne 12. dubna 2026", "místo a datum", [
    { cast: "adresa adresáta", why: "Adresa adresáta obsahuje ulici, číslo domu a město toho, komu dopis patří; tenhle řádek říká, kdy a odkud dopis vznikl." },
    { cast: "věc", why: "Věc pojmenovává téma dopisu, ne kdy vznikl." },
    { cast: "podpis", why: "Podpis je jméno pisatele na konci dopisu, ne datum." },
  ],
  "Je v řádku nějaké sdělení pro adresáta, nebo jen údaje? Rozeber je: je tu ulice a číslo domu, nebo něco jiného?",
  "Řádek říká, kdy a odkud dopis vznikl — proto je to místo a datum."),

  radekTask("Městský úřad Horní Lhota, Náměstí 5, 273 51 Horní Lhota", "adresa adresáta", [
    { cast: "místo a datum", why: "Místo a datum říká, kdy a odkud pisatel dopis píše; tenhle řádek je adresa úřadu, kterému dopis patří." },
    { cast: "podpis", why: "Podpis je jméno pisatele, ne adresa instituce." },
    { cast: "věc", why: "Věc stručně pojmenovává téma dopisu jedním souslovím, ne celou adresu." },
  ],
  "Rozeber řádek po částech: čí je to jméno — pisatele, nebo instituce? A k čemu slouží ulice, číslo domu a PSČ?",
  "Řádek uvádí ulici, číslo a město instituce, které je dopis určen — proto je to adresa adresáta."),

  radekTask("Jak se máš? Dlouho jsem ti nepsal.", "úvod", [
    { cast: "jádro", why: "Jádro obsahuje hlavní sdělení — v tomto dopise je to až vyprávění o výletě do jeskyní; tahle věta jen navazuje rozhovor." },
    { cast: "závěr", why: "Závěr stojí na konci těsně před rozloučením; tahle věta je hned za oslovením." },
    { cast: "oslovení", why: "Oslovení jmenuje adresáta („Ahoj Ondro,“); tahle věta už je celá souvislá výpověď." },
  ],
  "Podívej se, co v dopise stojí před touhle větou a co po ní. Vypráví už věta to hlavní, o čem chce pisatel psát, nebo teprve navazuje rozhovor?",
  "Věta stojí hned za oslovením a hlavní vyprávění teprve chystá — proto je to úvod.",
  ["Ahoj Ondro,", "Jak se máš? Dlouho jsem ti nepsal.", "Minulý týden jsme byli se třídou na výletě v jeskyních a viděli jsme spící netopýry.", "Měj se,", "Filip"]),

  radekTask("Dovoluji si Vás požádat o prodloužení výpůjční doby o dva týdny.", "jádro", [
    { cast: "úvod", why: "Úvod dopis jen zahajuje; hlavní prosba přichází až v tomhle řádku." },
    { cast: "věc", why: "Věc je jen krátký název tématu nad textem, ne celá formulovaná prosba." },
    { cast: "závěr", why: "Závěr dopis uzavírá, například poděkováním; samotná prosba patří jinam." },
  ],
  "Zeptej se, proč vlastně pisatel dopis píše. Je to právě tahle věta, nebo věta, která dopis jen zahajuje či uzavírá?",
  "Věta obsahuje hlavní prosbu dopisu — proto je to jádro."),

  radekTask("Byla jsem se o víkendu podívat na nové kotě, které si pořídili sousedi.", "jádro", [
    { cast: "úvod", why: "Úvod dopis teprve zahajuje; tahle věta už vypráví konkrétní zážitek — to je hlavní sdělení." },
    { cast: "závěr", why: "Závěr dopis uzavírá; tahle věta je uprostřed vyprávění." },
    { cast: "podpis", why: "Podpis je jméno pisatele, ne vyprávěná věta." },
  ],
  "Zeptej se, o čem chce pisatelka kamarádce hlavně napsat. Je to tahle věta, nebo jen zahájení či rozloučení?",
  "Věta obsahuje hlavní vyprávěný zážitek dopisu — proto je to jádro."),
];

// ── L1 (b) — daný adresát → vhodné oslovení nebo pozdrav ────────────────────

const SOUKROME_OSLOVENI = ["Milá babičko,", "Ahoj Ondro,", "Ahoj Aničko,", "Milý dědečku,"];
const UREDNI_OSLOVENI = ["Vážená paní ředitelko,", "Vážený pane řediteli,", "Vážení,"];

function osloveniWhy(blizky: boolean, d: string): string {
  return blizky
    ? `Oslovení „${d}“ je úřední a zdvořilostně odtažité; blízkému člověku, kterému tykáš, patří vřelejší oslovení.`
    : `Oslovení „${d}“ patří blízkému člověku, kterému tykáme; cizímu dospělému nebo instituci, které vykáš, se nehodí.`;
}

function osloveniTask(adresat: string, spravna: string, blizky: boolean, distraktory: string[]): PracticeTask | null {
  return choice(
    `Jakým oslovením začneš dopis ${adresat}?`,
    spravna,
    distraktory.map((d) => ({ value: d, why: osloveniWhy(blizky, d) })),
    {
      hints: [
        "Je adresát blízký člověk, kterému tykáš, nebo cizí dospělý či instituce?",
        blizky
          ? "Blízkým lidem — rodině a kamarádům — píšeme vřele, tykáme a oslovujeme je jejich jménem nebo rodinným označením."
          : "Cizím dospělým a institucím vykáme a oslovujeme je zdvořile — slovem „vážený“ nebo „vážená“ a funkcí, nebo souhrnnou zdvořilou formulí, když adresát nemá jedno jméno.",
      ],
      explanation: blizky
        ? `Píšeš blízkému člověku, proto dopis začneš vřelým oslovením „${spravna}“.`
        : `Píšeš cizímu dospělému nebo instituci, proto dopis začneš zdvořilým oslovením „${spravna}“.`,
    },
  );
}

const FORMAT_B_OSLOVENI: (PracticeTask | null)[] = [
  osloveniTask("babičce", "Milá babičko,", true, UREDNI_OSLOVENI),
  osloveniTask("kamarádovi Ondrovi", "Ahoj Ondro,", true, UREDNI_OSLOVENI),
  osloveniTask("sestřenici Aničce", "Ahoj Aničko,", true, UREDNI_OSLOVENI),
  osloveniTask("dědečkovi", "Milý dědečku,", true, UREDNI_OSLOVENI),
  osloveniTask("paní ředitelce školy", "Vážená paní ředitelko,", false, [SOUKROME_OSLOVENI[0], SOUKROME_OSLOVENI[1], SOUKROME_OSLOVENI[3]]),
  osloveniTask("řediteli ZUŠ", "Vážený pane řediteli,", false, [SOUKROME_OSLOVENI[1], SOUKROME_OSLOVENI[2], SOUKROME_OSLOVENI[3]]),
  osloveniTask("městskému úřadu", "Vážení,", false, [SOUKROME_OSLOVENI[0], SOUKROME_OSLOVENI[1], SOUKROME_OSLOVENI[2]]),
  osloveniTask("knihovně", "Vážení,", false, [SOUKROME_OSLOVENI[1], SOUKROME_OSLOVENI[2], SOUKROME_OSLOVENI[3]]),
  osloveniTask("správě sportovní haly", "Vážení,", false, [SOUKROME_OSLOVENI[2], SOUKROME_OSLOVENI[3], SOUKROME_OSLOVENI[0]]),
];

const FORMAT_B_POZDRAV: (PracticeTask | null)[] = [
  choice(
    "Jaký pozdrav použiješ na konci dopisu paní ředitelce?",
    "S pozdravem",
    [
      { value: "Měj se,", why: "Blízké a hovorové rozloučení k paní ředitelce nepatří, dopis jí končíme zdvořilou formulí." },
      { value: "Ahoj,", why: "Ahoj patří kamarádům, ne zdvořilému rozloučení s ředitelkou." },
      { value: "Pa pa,", why: "Pa pa je rodinné a hravé rozloučení, do úředního dopisu nepatří." },
    ],
    {
      hints: [
        "Paní ředitelce dopis píšeš jako cizí dospělé osobě, ne jako kamarádce.",
        "Cizím dospělým a institucím dopis končíme ustálenou zdvořilou formulí, ne rodinným nebo kamarádským rozloučením.",
      ],
      explanation: "Úřední dopis se zdvořile končí formulí „S pozdravem“ (bez čárky).",
    },
  ),
  choice(
    "Jaký pozdrav použiješ na konci dopisu babičce?",
    "Měj se hezky,",
    [
      { value: "S pozdravem", why: "„S pozdravem“ je neutrální, neosobní formule — k babičce je příliš chladná, píšeme jí vřele a přirozeně." },
      { value: "S úctou", why: "„S úctou“ je ještě formálnější a k babičce zní strojeně." },
      { value: "Vážení,", why: "„Vážení“ oslovuje neznámou instituci, ne blízkou babičku." },
    ],
    {
      hints: [
        "Babička je blízký člověk, kterému tykáš, ne cizí úřad.",
        "Blízkým lidem dopis končíme vřele a osobně, ne neutrální nebo úřední formulí, kterou bychom napsali cizímu.",
      ],
      explanation: "Babičce se dopis končí vřele, třeba „Měj se hezky,“.",
    },
  ),
];

const L1: PracticeTask[] = [...FORMAT_A, ...FORMAT_B_OSLOVENI, ...FORMAT_B_POZDRAV].filter((t): t is PracticeTask => t !== null);

// ── L2 — situace + vhodná formulace ──────────────────────────────────────────

function situaceTask(
  situace: string,
  otazka: string,
  spravna: string,
  distraktory: Distractor[],
  hints: [string, string],
  explanation: string,
): PracticeTask | null {
  return choice(`${situace} ${otazka}`, spravna, distraktory, { hints, explanation });
}

const HINT1_UREDNI = "Instituci nebo cizímu dospělému vykáme, prosíme zdvořile a jasně řekneme, oč jde; věta nesmí znít jako rozkaz, hovorově ani mlhavě.";
const HINT1_SOUKROME = "Blízkému člověku píšeme přirozeně a vřele, tykáme mu a vyhýbáme se strojeným úředním obratům, které by zněly cize.";
const HINT1_VEC = "Řádek Věc není věta ani oslovení — je to krátký, spisovný a konkrétní název toho, oč v dopise jde. Nesmí být příliš obecný ani hovorový.";

const L2: (PracticeTask | null)[] = [
  situaceTask(
    "Tereza píše správě koupaliště, protože tam o víkendu zapomněla mikinu.",
    "Kterou úvodní větu použije?",
    "Obracím se na Vás s prosbou o pomoc se ztracenou věcí.",
    [
      { value: "Obracím se na tebe s prosbou o pomoc se ztracenou věcí.", why: "Věta je zdvořilá, ale tyká — správě koupaliště se vyká." },
      { value: "Dovoluji si Vás tímto zdvořile oslovit.", why: "Zdvořilé, ale z věty vůbec není poznat, proč Tereza píše." },
      { value: "Hele, nenašli jste tam náhodou mikinu?", why: "Hovorové „hele“ a neformální tón se do žádosti instituci nehodí." },
    ],
    [
      "Píše Tereza kamarádovi, nebo instituci, kterou osobně nezná?",
      HINT1_UREDNI,
    ],
    "Správě koupaliště Tereza vyká a hned zdvořile řekne, s čím se na ni obrací, i když jde jen o zapomenutou mikinu.",
  ),
  situaceTask(
    "Filip píše knihovně, protože chce prodloužit výpůjční dobu knihy o dva týdny.",
    "Kterou větou vyjádří hlavní prosbu?",
    "Prosím Vás o prodloužení výpůjční doby o dva týdny.",
    [
      { value: "Prosím tě o prodloužení výpůjční doby o dva týdny.", why: "Prosba je jasná, ale tyká — knihovně jako instituci se vyká." },
      { value: "Prosím Vás o vyřízení mé záležitosti.", why: "Zdvořilé, ale neříká, o co Filip žádá — knihovna by se musela doptávat." },
      { value: "Prodlužte mi to, ať to stihnu.", why: "Rozkazovací způsob zní nezdvořile, chybí prosba." },
    ],
    [
      "Filip píše knihovně jako instituci — jak se k ní chováme v žádosti?",
      HINT1_UREDNI,
    ],
    "Knihovně Filip zdvořile vyká a jasně napíše, o co prosí.",
  ),
  situaceTask(
    "Klářina maminka píše řediteli školy žádost o uvolnění Kláry na sportovní závody.",
    "Jak napíše řádek Věc?",
    "Věc: Žádost o uvolnění z vyučování",
    [
      { value: "Věc: Prosba", why: "Příliš obecné — z řádku není poznat, o co se žádá." },
      { value: "Věc: Závody, prosím pustit Kláru", why: "Útržkovité a hovorové; řádek Věc má být spisovný název tématu." },
      { value: "Věc: Chtěla bych Vás poprosit, jestli by Klára mohla na závody", why: "To je celá věta prosby, ne krátký název tématu — ta patří až do textu dopisu." },
    ],
    [
      "Řádek Věc stojí nahoře nad oslovením a krátce říká, čeho se dopis týká.",
      HINT1_VEC,
    ],
    "Řádek Věc jasně, stručně a spisovně pojmenuje, oč se žádost týká.",
  ),
  situaceTask(
    "Matěj píše dopravnímu podniku, protože autobus nepřijel podle jízdního řádu.",
    "Kterou úvodní větu použije?",
    "Chtěl bych Vás upozornit na zpoždění autobusu linky 15 dne 3. května.",
    [
      { value: "Ten váš autobus zase nepřijel, co to má znamenat?", why: "Obviňující a nezdvořilý tón se do dopisu instituci nehodí." },
      { value: "Autobusy jsou hrozný, furt meškaj.", why: "Nespisovné tvary „hrozný“ a „meškaj“ do dopisu instituci nepatří." },
      { value: "Doufám, že si příště pohlídáte čas.", why: "Věta zní útočně, chybí věcné oznámení problému." },
    ],
    [
      "Matěj oznamuje problém instituci, ne kamarádovi — jak má znít taková věta?",
      HINT1_UREDNI,
    ],
    "Dopravnímu podniku Matěj věcně a zdvořile oznámí, co se stalo a kdy.",
  ),
  situaceTask(
    "Ema píše zoo se žádostí o slevu na vstupném pro školní výlet.",
    "Kterou větou vyjádří hlavní prosbu?",
    "Prosím Vás o zvážení slevy na vstupném pro naši třídu.",
    [
      { value: "Chtěla bych tě poprosit o slevu na vstupném pro naši třídu.", why: "Prosba je jasná, ale tyká — zoo jako instituci se vyká." },
      { value: "Tímto Vás žádám o vyřízení naší záležitosti.", why: "Zdvořilé, ale z věty není poznat, že jde o slevu na vstupném." },
      { value: "Snad nám tu slevu dáte, jinak nepřijedeme.", why: "Vyhrožování a podmínka nejsou zdvořilá prosba." },
    ],
    [
      "Ema píše zoo jako instituci — jak formuluje zdvořilou prosbu?",
      HINT1_UREDNI,
    ],
    "Zoo Ema vyká, zdvořile a konkrétně požádá o zvážení slevy, nevyhrožuje ani nemlží.",
  ),
  situaceTask(
    "Vojta píše plaveckému klubu žádost o přijetí do kurzu.",
    "Jak napíše řádek Věc?",
    "Věc: Přihláška do plaveckého kurzu",
    [
      { value: "Věc: Plavání", why: "Příliš obecné — z řádku není poznat, že jde o přihlášku do kurzu." },
      { value: "Věc: Chci chodit plavat, berete ještě lidi?", why: "Hovorová otázka, ne spisovný název tématu." },
      { value: "Věc: Dovoluji si Vás tímto požádat o přijetí mé osoby do kurzu", why: "Strojená celá věta; řádek Věc je jen krátký název, prosba patří do textu." },
    ],
    [
      "Řádek Věc má krátce říct, oč v žádosti jde, ještě než adresát začne číst.",
      HINT1_VEC,
    ],
    "Řádek Věc stručně a spisovně pojmenuje, že jde o přihlášku do kurzu.",
  ),
  situaceTask(
    "Bára píše správě sportovní haly žádost o rezervaci haly na turnaj.",
    "Jak zformuluje hlavní prosbu?",
    "Dovoluji si Vás požádat o rezervaci sportovní haly na turnaj.",
    [
      { value: "Chtěla bych tě poprosit o rezervaci haly na turnaj.", why: "Prosba je jasná, ale tyká — správě haly se vyká." },
      { value: "Dovoluji si Vás tímto co nejzdvořileji požádat o laskavé zvážení mé žádosti.", why: "Přehnaně strojené, a přitom z věty není poznat, o co Bára žádá." },
      { value: "Zamluvte nám halu na sobotu, díky.", why: "Rozkazovací způsob a neformální poděkování se do žádosti nehodí." },
    ],
    [
      "Bára žádá instituci — jak zní zdvořilá a zároveň konkrétní prosba?",
      HINT1_UREDNI,
    ],
    "Správě haly Bára vyká a zdvořile, ale konkrétně napíše, o co žádá.",
  ),
  situaceTask(
    "David píše obecnímu úřadu žádost o povolení konat sběr papíru ve škole.",
    "Kterou větou vyjádří hlavní prosbu?",
    "Prosím Vás o vydání povolení k pořádání sběru papíru.",
    [
      { value: "Prosím Vás o vydání povolení.", why: "Zdvořilé, ale neříká, jaké povolení a k čemu — úřad by se musel doptávat." },
      { value: "Snad to povolíte, ne?", why: "Hovorové a nejisté vyjádření místo jasné prosby." },
      { value: "Povolení bysme potřebovali, jasný.", why: "Nespisovné tvary „bysme“ a „jasný“ do žádosti úřadu nepatří." },
    ],
    [
      "David žádá úřad o povolení — jak zní zdvořilá prosba?",
      HINT1_UREDNI,
    ],
    "Úřadu David zdvořile napíše přesně, o jaké povolení prosí.",
  ),

  situaceTask(
    "Petra píše babičce poděkování za dárek k narozeninám.",
    "Kterou větou poděkuje?",
    "Moc ti děkuju za krásný dárek, mám z něj radost.",
    [
      { value: "S díky za obdržený dárek Vám zůstávám oddaná vnučka.", why: "Tak strojeně a úředně babičce nepíšeme, i poděkování má znít přirozeně a vřele." },
      { value: "Děkuji Vám za laskavě zaslaný dárek.", why: "Vykání a kancelářský styl k babičce nepatří." },
      { value: "Tímto Vám potvrzuji přijetí dárku.", why: "To zní jako úřední potvrzení, ne jako vřelé poděkování blízkému člověku." },
    ],
    [
      "Babičce Petra tyká — jak zní přirozené, vřelé poděkování?",
      HINT1_SOUKROME,
    ],
    "Babičce Petra poděkuje přirozeně a s tykáním, ne kancelářským stylem.",
  ),
  situaceTask(
    "Honza píše kamarádovi z tábora, že se těší na příští léto.",
    "Kterou úvodní větu použije?",
    "Ahoj, jak se máš? Já se už teď těším na příští tábor!",
    [
      { value: "Vážený příteli, dovoluji si Vás informovat o svém očekávání příštího léta.", why: "Úřední oslovení a styl ke kamarádovi z tábora nepatří." },
      { value: "Oznamuji Vám, že se těším na tábor.", why: "Úřední oznámení a vykání se ke kamarádovi nehodí." },
      { value: "S pozdravem se těším na léto.", why: "„S pozdravem“ patří na konec dopisu, ne na jeho úvod." },
    ],
    [
      "Honza píše kamarádovi, kterému tyká — jak zní přirozený úvod dopisu?",
      HINT1_SOUKROME,
    ],
    "Kamarádovi Honza napíše přirozený, kamarádský úvod s tykáním.",
  ),
  situaceTask(
    "Anička píše sestřenici o tom, jaké to bylo na prázdninovém táboře.",
    "Jak se rozloučí?",
    "Měj se moc hezky a piš mi, jak se máš!",
    [
      { value: "S pozdravem Anna Nováková", why: "Neutrální, neosobní pozdrav s celým jménem je k sestřenici příliš chladný." },
      { value: "S úctou se s Vámi loučím.", why: "Přehnaně úřední rozloučení k blízké sestřenici nepatří." },
      { value: "Přijměte prosím mé pozdravy.", why: "Kancelářský tón se do dopisu sestřenici nehodí." },
    ],
    [
      "Sestřenici Anička tyká — jak zní vřelé rozloučení mezi blízkými?",
      HINT1_SOUKROME,
    ],
    "Se sestřenicí se Anička rozloučí vřele a s tykáním, ne neosobní nebo úřední formulí.",
  ),
  situaceTask(
    "Kuba píše dědečkovi o tom, jak dopadl fotbalový zápas.",
    "Kterou úvodní větu použije?",
    "Ahoj dědo, chci ti povyprávět, jak dopadl náš zápas!",
    [
      { value: "Vážený pane, dovoluji si Vás informovat o výsledku utkání.", why: "Úřední oslovení a styl k dědečkovi nepatří." },
      { value: "Tímto Vám oznamuji výsledek fotbalového zápasu.", why: "Byrokratické oznámení se k dědečkovi nehodí." },
      { value: "Věc: Výsledek zápasu", why: "Řádek Věc patří do úředních dopisů, ne do dopisu dědečkovi." },
    ],
    [
      "Dědečkovi Kuba tyká — jak zní přirozený, kamarádský úvod?",
      HINT1_SOUKROME,
    ],
    "Dědečkovi Kuba napíše přirozený úvod s tykáním, ne úřední oznámení.",
  ),
  situaceTask(
    "Tereza píše bývalé spolužačce Elišce, která se přestěhovala, aby jí popsala nový rok ve třídě.",
    "Jak se rozloučí?",
    "Napiš mi zase brzy, moc ráda si tvoje dopisy čtu!",
    [
      { value: "Očekávám Vaši odpověď v nejbližším možném termínu.", why: "Úřední fráze o termínu odpovědi ke kamarádce nepatří." },
      { value: "Žádám Vás o zaslání odpovědi.", why: "Slovo „žádám“ a vykání zní ke kamarádce úředně." },
      { value: "S pozdravem očekávám Vaše stanovisko.", why: "Byrokratické „stanovisko“ se do dopisu kamarádce nehodí." },
    ],
    [
      "Elišce Tereza tyká jako bývalé spolužačce — jak zní přirozené rozloučení?",
      HINT1_SOUKROME,
    ],
    "S Eliškou se Tereza rozloučí přirozeně a s tykáním, ne úřední žádostí o odpověď.",
  ),
  situaceTask(
    "Ondra píše babičce, že jí posílá pozdrav z lyžařského výcviku.",
    "Kterou úvodní větu použije?",
    "Ahoj babi, píšu ti z lyžáku, je tu super sníh!",
    [
      { value: "Vážená paní, informuji Vás o svém pobytu na horách.", why: "Úřední oslovení a styl k babičce nepatří." },
      { value: "Tímto Vám oznamuji, že jsem na horách.", why: "Byrokratické oznámení se k babičce nehodí." },
      { value: "Věc: Pobyt na horách", why: "Řádek Věc patří do úředních dopisů, ne do dopisu babičce." },
    ],
    [
      "Babičce Ondra tyká — jak zní přirozený, veselý úvod dopisu?",
      HINT1_SOUKROME,
    ],
    "Babičce Ondra napíše přirozený, veselý úvod s tykáním, ne úřední oznámení.",
  ),
];

// ── L3 — analýza hotového dopisu ─────────────────────────────────────────────

// (a) Který řádek do dopisu nepatří.
function nepatriTask(lines: string[], druh: "úředního" | "soukromého", bad: string, ostatni: { line: string; why: string }[], explanation: string): PracticeTask | null {
  return choice(
    `Dopis: ${letter(lines)} Který z těchto řádků do tohoto ${druh} dopisu nepatří?`,
    bad,
    ostatni.map((o) => ({ value: o.line, why: o.why })),
    {
      hints: [
        "Nejdřív si řekni, komu je dopis určený a proč — podle toho poznáš, jaký styl by měl mít celý.",
        "Projdi řádek po řádku a hledej ten, který se stylem od ostatních liší (hovorové slovo, smajlík, nebo naopak přehnaně úřední výraz). Ostatní řádky ber jako vzor toho, jak má dopis znít.",
      ],
      explanation,
    },
  );
}

const L3A: (PracticeTask | null)[] = [
  nepatriTask(
    ["Vážená paní ředitelko,", "prosím Vás o uvolnění dcery Petry z vyučování dne 10. května kvůli účasti na krajském kole recitační soutěže.", "Předem děkuji za kladné vyřízení.", "Měj se!", "S pozdravem", "Eva Malá"],
    "úředního",
    "Měj se!",
    [
      { line: "Vážená paní ředitelko,", why: "Tenhle řádek do úředního dopisu patří — je to zdvořilé oslovení adresátky." },
      { line: "Předem děkuji za kladné vyřízení.", why: "Tenhle řádek do úředního dopisu patří — zdvořile uzavírá prosbu poděkováním." },
      { line: "S pozdravem", why: "Tenhle řádek do úředního dopisu patří — je to zdvořilá závěrečná formule." },
    ],
    "„Měj se!“ je hovorové a tykavé rozloučení, které do zdvořilého úředního dopisu nepatří — ten se uzavírá formulí „S pozdravem“.",
  ),
  nepatriTask(
    ["Vážení,", "žádám o prodloužení výpůjční doby knihy Harry Potter a Fénixův řád o dva týdny.", "Děkuji za vyřízení :)", "S pozdravem", "Tomáš Beneš"],
    "úředního",
    "Děkuji za vyřízení :)",
    [
      { line: "Vážení,", why: "Tenhle řádek do úředního dopisu patří — zdvořile oslovuje instituci bez jednoho jména." },
      { line: "žádám o prodloužení výpůjční doby knihy Harry Potter a Fénixův řád o dva týdny.", why: "Tenhle řádek do úředního dopisu patří — jasně formulovaná prosba." },
      { line: "S pozdravem", why: "Tenhle řádek do úředního dopisu patří — je to zdvořilá závěrečná formule." },
    ],
    "Smajlík „:)“ do úředního dopisu nepatří — i poděkování se v žádosti píše formálně, bez emotikonů.",
  ),
  nepatriTask(
    ["Vážení,", "chtěl bych upozornit, že autobus linky 8 dnes vůbec nepřijel.", "Bylo to fakt otrava.", "S pozdravem", "Jakub Dvořák"],
    "úředního",
    "Bylo to fakt otrava.",
    [
      { line: "Vážení,", why: "Tenhle řádek do úředního dopisu patří — zdvořile oslovuje instituci." },
      { line: "chtěl bych upozornit, že autobus linky 8 dnes vůbec nepřijel.", why: "Tenhle řádek do úředního dopisu patří — věcně oznamuje problém." },
      { line: "S pozdravem", why: "Tenhle řádek do úředního dopisu patří — je to zdvořilá závěrečná formule." },
    ],
    "„Bylo to fakt otrava“ je hovorové a nespisovné vyjádření, které do věcného oznámení dopravnímu podniku nepatří.",
  ),
  nepatriTask(
    ["Milá babičko,", "moc se mi stýská, jak se máš?", "Ve škole se mi teď daří, mám samé jedničky z matematiky.", "S úctou", "Tvá vnučka Eliška"],
    "soukromého",
    "S úctou",
    [
      { line: "Milá babičko,", why: "Tenhle řádek do dopisu babičce patří — je to vřelé oslovení blízké osoby." },
      { line: "moc se mi stýská, jak se máš?", why: "Tenhle řádek do dopisu babičce patří — přirozený úvod." },
      { line: "Ve škole se mi teď daří, mám samé jedničky z matematiky.", why: "Tenhle řádek do dopisu babičce patří — vyprávění o sobě." },
    ],
    "„S úctou“ je strojená úřední formule; babičce se dopis končí vřele, třeba „Měj se moc hezky“.",
  ),
  nepatriTask(
    ["Ahoj Marku,", "Věc: Prázdninový tábor", "byl jsem na skvělém táboře, hráli jsme celý týden bojovku.", "Měj se,", "Filip"],
    "soukromého",
    "Věc: Prázdninový tábor",
    [
      { line: "Ahoj Marku,", why: "Tenhle řádek do dopisu kamarádovi patří — přirozené oslovení." },
      { line: "byl jsem na skvělém táboře, hráli jsme celý týden bojovku.", why: "Tenhle řádek do dopisu kamarádovi patří — vyprávění zážitku." },
      { line: "Měj se,", why: "Tenhle řádek do dopisu kamarádovi patří — přirozené rozloučení." },
    ],
    "Řádek „Věc:“ patří do úředních dopisů, ne do dopisu kamarádovi — ten žádný věcný nadpis nepotřebuje.",
  ),
  nepatriTask(
    ["Vážený pane řediteli,", "žádám o přijetí do hudebního oboru od září.", "Snad mě vezmete, ne?", "S pozdravem", "Anna Svobodová"],
    "úředního",
    "Snad mě vezmete, ne?",
    [
      { line: "Vážený pane řediteli,", why: "Tenhle řádek do úředního dopisu patří — zdvořilé oslovení." },
      { line: "žádám o přijetí do hudebního oboru od září.", why: "Tenhle řádek do úředního dopisu patří — jasná prosba." },
      { line: "S pozdravem", why: "Tenhle řádek do úředního dopisu patří — zdvořilá závěrečná formule." },
    ],
    "„Snad mě vezmete, ne?“ zní pochybovačně a nezdvořile; žádost má prosit jasně a s úctou, ne pochybovat o výsledku.",
  ),
];

// (b) Která náležitost v úředním dopise chybí.
type Polozka = "věc" | "místo a datum" | "podpis" | "konkrétní požadavek";

function chybiTask(lines: string[], missing: Polozka, ostatni: { cat: Polozka; why: string }[], explanation: string): PracticeTask | null {
  return choice(
    `Dopis: ${letter(lines)} Co v tomto úředním dopise chybí?`,
    missing,
    ostatni.map((o) => ({ value: o.cat, why: o.why })),
    {
      hints: [
        "Projdi dopis shora dolů a u každého řádku si řekni, kterou část úředního dopisu tvoří.",
        "Zeptej se jako adresát: poznám, čeho se dopis týká, kdy byl napsán, co přesně po mně pisatel chce a kdo ho posílá? Na kterou z těch otázek dopis neodpoví?",
      ],
      explanation,
    },
  );
}

const L3B: (PracticeTask | null)[] = [
  chybiTask(
    ["V Plzni dne 5. března 2026", "Věc: Žádost o uvolnění z vyučování", "Vážená paní ředitelko,", "prosím o uvolnění syna Jakuba Krále z vyučování dne 12. března kvůli lékařskému vyšetření.", "S pozdravem"],
    "podpis",
    [
      { cat: "věc", why: "Věc v žádosti je — řádek „Věc: Žádost o uvolnění z vyučování“." },
      { cat: "místo a datum", why: "Místo a datum v žádosti jsou — řádek „V Plzni dne 5. března 2026“." },
      { cat: "konkrétní požadavek", why: "Konkrétní požadavek v žádosti je — uvolnění syna Jakuba Krále dne 12. března." },
    ],
    "Po pozdravu chybí jméno pisatele — bez podpisu není poznat, kdo o uvolnění žádá, a škola žádost nemůže vyřídit.",
  ),
  chybiTask(
    ["V Brně dne 2. dubna 2026", "Vážení,", "prosím o zapůjčení sportovní haly na sobotu 18. dubna pro fotbalový turnaj naší třídy.", "S pozdravem", "Martin Horák"],
    "věc",
    [
      { cat: "místo a datum", why: "Místo a datum v žádosti jsou — řádek „V Brně dne 2. dubna 2026“." },
      { cat: "konkrétní požadavek", why: "Konkrétní požadavek v žádosti je — zapůjčení haly na sobotu 18. dubna." },
      { cat: "podpis", why: "Podpis v žádosti je — jméno „Martin Horák“ na konci." },
    ],
    "Mezi datem a oslovením chybí věc. Je to povinná náležitost úředního dopisu: adresát podle ní na první pohled pozná, čeho se dopis týká.",
  ),
  chybiTask(
    ["Věc: Žádost o prodloužení výpůjční doby", "Vážená paní knihovnice,", "prosím o prodloužení výpůjční doby knihy Deník malého poseroutky o dva týdny.", "S pozdravem", "Klára Veselá"],
    "místo a datum",
    [
      { cat: "věc", why: "Věc v žádosti je — řádek „Věc: Žádost o prodloužení výpůjční doby“." },
      { cat: "konkrétní požadavek", why: "Konkrétní požadavek v žádosti je — prodloužení výpůjční doby o dva týdny." },
      { cat: "podpis", why: "Podpis v žádosti je — jméno „Klára Veselá“ na konci." },
    ],
    "Nad věcí chybí místo a datum. Datum patří ke každému úřednímu dopisu: dokládá, kdy byla žádost podána, a podle něj se dopis eviduje.",
  ),
  chybiTask(
    ["V Ostravě dne 9. května 2026", "Věc: Stížnost na nesvítící lampy na hřišti v Lipové ulici", "Vážení,", "chtěl bych si postěžovat na to, jak to u vás chodí.", "S pozdravem", "Filip Novotný"],
    "konkrétní požadavek",
    [
      { cat: "věc", why: "Věc v dopise je — řádek „Věc: Stížnost na nesvítící lampy na hřišti v Lipové ulici“." },
      { cat: "místo a datum", why: "Místo a datum v dopise jsou — řádek „V Ostravě dne 9. května 2026“." },
      { cat: "podpis", why: "Podpis v dopise je — jméno „Filip Novotný“ na konci." },
    ],
    "Z textu není poznat, co přesně je špatně a co má úřad udělat — chybí konkrétní požadavek, třeba „žádám o opravu osvětlení“. Věta „jak to u vás chodí“ nic konkrétního neříká.",
  ),
];

// (c) Kterou opravou bude dopis v pořádku.
function opravaTask(lines: string[], aspekt: string, spravna: string, distraktory: Distractor[], hint: string, explanation: string): PracticeTask | null {
  return choice(
    `Dopis: ${letter(lines)} Kterou opravou bude ${aspekt} v pořádku?`,
    spravna,
    distraktory,
    {
      hints: ["Nejdřív urči, komu je dopis určen a jaký styl by měl mít celý.", hint],
      explanation,
    },
  );
}

const L3C: (PracticeTask | null)[] = [
  opravaTask(
    ["Ahoj paní ředitelko,", "prosím o uvolnění syna Tomáše z vyučování dne 20. května kvůli soutěži.", "Předem děkuji za kladné vyřízení.", "S pozdravem", "Jana Králová"],
    "oslovení v této žádosti ředitelce školy",
    "Vážená paní ředitelko,",
    [
      { value: "Čau paní ředitelko,", why: "„Čau“ je ještě hovorovější než „ahoj“ a do žádosti nepatří vůbec." },
      { value: "Milá paní ředitelko,", why: "„Milá“ je důvěrné oslovení pro blízké lidi; žádost je úřední dopis, proto se ředitelka oslovuje ustáleně „Vážená“, i když ji pisatelka zná." },
      { value: "Ahoj, paní ředitelko!", why: "Zůstává hovorové oslovení „ahoj“, jen s jinou interpunkcí — chyba se tím neopravila." },
    ],
    "Žádost je úřední dopis, i když pisatelka adresátku zná. Hledej oslovení, které je ustálené a zdvořilé, ne kamarádské ani důvěrné.",
    "V úřední žádosti se ředitelka školy oslovuje ustáleně „Vážená paní ředitelko,“ — bez ohledu na to, jestli se s pisatelkou zná.",
  ),
  opravaTask(
    ["Milá babičko,", "moc se mi po tobě stýská.", "Ve škole se mi daří.", "S úctou", "Tvůj vnuk Petr"],
    "rozloučení v tomto dopise babičce",
    "Měj se moc hezky,",
    [
      { value: "S pozdravem a díky za vyřízení", why: "Tak se končí úřední žádost, ne dopis babičce." },
      { value: "Přijměte prosím mé pozdravy.", why: "Vykání a kancelářský obrat patří do dopisu cizímu člověku nebo instituci, ne babičce." },
      { value: "S úctou a pozdravem", why: "Pořád obsahuje úřední „s úctou“, které k babičce nepatří." },
    ],
    "Babičce se píše vřele a osobně. Hledej rozloučení, které nezní úředně ani neutrálně chladně, ale tak, jak bys to babičce řekl při odchodu.",
    "Babičce se dopis končí vřele a přirozeně, ne úřední formulí jako „S úctou“.",
  ),
  opravaTask(
    ["V Liberci dne 1. června 2026", "Věc: Žádost o zapůjčení hřiště", "Vážení,", "chtěli bychom si hřiště půjčit, jasný?", "S pozdravem", "Pavel Zelený, třídní učitel 6. A"],
    "věta „chtěli bychom si hřiště půjčit, jasný?“",
    "prosíme o zapůjčení hřiště na fotbalový turnaj dne 15. června.",
    [
      { value: "chtěli bychom hřiště, dík.", why: "Zůstává hovorové a chybí konkrétní důvod i datum — adresát neví, na co a kdy hřiště chcete." },
      { value: "půjčte nám hřiště, ať máme klid.", why: "Zní to jako rozkaz, ne jako zdvořilá prosba." },
      { value: "hřiště by se nám hodilo, no ne?", why: "Zůstává hovorové a nejisté vyjádření místo jasné prosby." },
    ],
    "Věta má zdvořile a spisovně říct, co přesně se žádá a na kdy. Hledej opravu, ze které adresát pozná obojí.",
    "Prosba má být zdvořilá a konkrétní — má říct, co přesně a na kdy se žádá. Po oslovení „Vážení,“ pokračuje text malým písmenem.",
  ),
  opravaTask(
    ["Ahoj Kubo,", "jak se máš? Já jsem byl o prázdninách u moře.", "Bylo tam fakt super.", "S úctou", "Filip"],
    "rozloučení v tomto dopise kamarádovi",
    "Měj se a brzo napiš!",
    [
      { value: "Se zdvořilým pozdravem", why: "Zdvořilý pozdrav je odměřená formule pro cizí lidi a úřady — vyjadřuje odstup, ne kamarádství." },
      { value: "S úctou a pozdravem", why: "Pořád obsahuje úřední „s úctou“, které vyjadřuje odstup, ne kamarádství." },
      { value: "Se srdečným pozdravem Váš", why: "„Váš“ je vykání — kamarádovi tykáme." },
    ],
    "Kamarádovi se píše přirozeně, jako když spolu mluvíte. Hledej rozloučení, které nezní úředně ani kancelářsky a kamarádovi nevyká.",
    "„S úctou“ je úřední formule, která vyjadřuje odstup. Kamarádovi se dopis končí přirozeně, třeba „Měj se“ nebo „Ahoj“.",
  ),
];

const L3: PracticeTask[] = [...L3A, ...L3B, ...L3C].filter((t): t is PracticeTask => t !== null);

// ── Generátor ────────────────────────────────────────────────────────────────
/** Bez stavu mezi voláními — pouze zamíchá pevnou banku pro danou úroveň. */
function gen(level: number): PracticeTask[] {
  const bank = level >= 3 ? L3 : level === 2 ? L2.filter((t): t is PracticeTask => t !== null) : L1;
  return shuffle(bank);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const DOPIS_SOUKROMY_A_UREDNI: TopicMetadata[] = [
  {
    id: "g6-cjl-dopis-soukromy-a-uredni-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-soukromy-a-uredni",
    title: "Dopis soukromý a úřední",
    studentTitle: "Soukromý a úřední dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Poznáš, jak psát kamarádovi a jak úřadu, a opravíš chybu v dopise.",
    keywords: ["dopis", "soukromý dopis", "úřední dopis", "žádost", "oslovení", "rejstřík", "adresát"],
    goals: [
      "Rozpoznat části soukromého i úředního dopisu.",
      "Vybrat formulaci vhodnou pro daného adresáta a účel.",
      "Najít a opravit prvek, který do daného typu dopisu nepatří.",
    ],
    boundaries: [
      "Žák nic sám nepíše — jen vybírá a opravuje z nabízených možností.",
      "Bez podrobných pravidel poštovního styku a právních formalit.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív poznej, komu dopis patří a proč se píše — blízkému člověku, kterému tykáš, nebo cizímu dospělému či instituci, které vykáš. Podle toho volíš oslovení, formulace i pozdrav.",
      steps: [
        "Zjisti adresáta: je to rodina/kamarád (soukromý dopis), nebo cizí dospělý/úřad (úřední dopis)?",
        "U úředního dopisu zkontroluj: adresu odesílatele a adresáta, místo a datum, věc, oslovení, konkrétní požadavek, pozdrav, podpis.",
        "U soukromého dopisu piš přirozeně a vřele, ne strojeně úředně.",
        "Když hledáš chybu v hotovém dopise, projdi řádek po řádku a hledej ten, který stylem nesedí k ostatním.",
      ],
      commonMistake: "Žáci často píšou úřadu stejně jako kamarádovi (hovorově), nebo naopak kamarádovi přehnaně úředně — rejstřík se volí podle adresáta, ne podle zvyku.",
      example: "Úřední dopis: „Vážená paní ředitelko, prosím Vás o uvolnění syna z vyučování. S pozdravem“ Kamarádovi: „Ahoj Ondro, jak se máš? Měj se, Filip.“",
    },
  },
];
