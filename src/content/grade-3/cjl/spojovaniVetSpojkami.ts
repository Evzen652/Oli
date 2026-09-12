import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

/**
 * Přepsáno 2026-09-12 (inventura obsahu, dávka g3cjl-a).
 *
 * Předtím: chybná možnost nikde neměla zpětnou vazbu, malá nápověda byla
 * u 28 úloh stejná a úrovně byly obráceně (L1 = doplňování spojky do věty,
 * L2 = pouhé pojmenování, co spojka vyjadřuje).
 *
 * Teď tři disjunktní banky ve správném pořadí:
 *   L1 — rozpoznání: poznat spojku mezi slovy jiných slovních druhů.
 *   L2 — aplikace: doplnit do věty spojku podle vztahu obou částí.
 *   L3 — transfer: spojit dvě samostatné věty v souvětí a říct totéž
 *        jinou spojkou (obrácení příčiny a následku).
 *
 * Interpunkce je v každé větě podle pravidla: před slučovacím „a“ čárka není,
 * před „ale, protože, když, aby, až, takže“ a před vylučovacím „nebo“ ano.
 */

// ── Slovní zásoba ───────────────────────────────────────────────────────────

/** Co která spojka vyjadřuje — jde do zpětné vazby u chybných možností. */
const VYZNAM: Record<string, string> = {
  a: "přidává druhý děj k prvnímu",
  ale: "staví druhou větu proti první",
  nebo: "nabízí výběr ze dvou možností",
  protože: "vysvětluje důvod",
  když: "určuje čas nebo podmínku",
  aby: "vyjadřuje účel nebo přání",
  až: "říká, kdy něco nastane",
  takže: "ukazuje, co z toho plyne",
};

interface Nespojka { slovo: string; druh: string }

const N: Record<string, Nespojka> = {
  rychle: { slovo: "rychle", druh: "příslovce — říká, JAK se něco děje" },
  velký: { slovo: "velký", druh: "přídavné jméno — popisuje vlastnost" },
  strom: { slovo: "strom", druh: "podstatné jméno — pojmenovává věc" },
  běžet: { slovo: "běžet", druh: "sloveso — vyjadřuje děj" },
  hodně: { slovo: "hodně", druh: "příslovce — vyjadřuje míru" },
  modrý: { slovo: "modrý", druh: "přídavné jméno — popisuje barvu" },
  kniha: { slovo: "kniha", druh: "podstatné jméno — pojmenovává věc" },
  spát: { slovo: "spát", druh: "sloveso — vyjadřuje děj" },
  pomalu: { slovo: "pomalu", druh: "příslovce — říká, JAK se něco děje" },
  veselý: { slovo: "veselý", druh: "přídavné jméno — popisuje náladu" },
  škola: { slovo: "škola", druh: "podstatné jméno — pojmenovává místo" },
  zpívat: { slovo: "zpívat", druh: "sloveso — vyjadřuje děj" },
  včera: { slovo: "včera", druh: "příslovce — určuje čas" },
  malý: { slovo: "malý", druh: "přídavné jméno — popisuje velikost" },
  pes: { slovo: "pes", druh: "podstatné jméno — pojmenovává zvíře" },
  kreslit: { slovo: "kreslit", druh: "sloveso — vyjadřuje děj" },
  potichu: { slovo: "potichu", druh: "příslovce — říká, JAK se něco děje" },
  teplý: { slovo: "teplý", druh: "přídavné jméno — popisuje teplotu" },
};

// ── L1 · poznej spojku ──────────────────────────────────────────────────────

const NAJDI_SPOJKU: [string, Nespojka, Nespojka, Nespojka][] = [
  ["ale", N.rychle, N.velký, N.strom],
  ["nebo", N.běžet, N.hodně, N.modrý],
  ["protože", N.kniha, N.spát, N.pomalu],
  ["když", N.veselý, N.škola, N.zpívat],
  ["aby", N.včera, N.malý, N.pes],
  ["až", N.kreslit, N.potichu, N.teplý],
  ["takže", N.strom, N.běžet, N.veselý],
  ["a", N.modrý, N.kniha, N.včera],
];

const NAJDI_NESPOJKU: [Nespojka, string, string, string][] = [
  [N.rychle, "ale", "protože", "nebo"],
  [N.strom, "když", "aby", "takže"],
  [N.spát, "nebo", "až", "ale"],
  [N.modrý, "protože", "když", "aby"],
  [N.škola, "takže", "ale", "až"],
  [N.zpívat, "protože", "nebo", "když"],
  [N.malý, "aby", "takže", "protože"],
  [N.hodně, "až", "nebo", "ale"],
];

function najdiSpojku([s, d1, d2, d3]: [string, Nespojka, Nespojka, Nespojka]): PracticeTask {
  return choice(
    "Které z těchto slov je spojka?",
    s,
    [
      { value: d1.slovo, why: `„${d1.slovo}“ je ${d1.druh}. Dvě věty samo nespojí.` },
      { value: d2.slovo, why: `„${d2.slovo}“ je ${d2.druh}. Dvě věty samo nespojí.` },
      { value: d3.slovo, why: `„${d3.slovo}“ je ${d3.druh}. Dvě věty samo nespojí.` },
    ],
    {
      hints: [
        `Slova „${d1.slovo}“ i „${d2.slovo}“ něco pojmenovávají či popisují. Spojka nic z toho nedělá — jenom spojuje.`,
        `Spojka nepojmenovává věc, nepopisuje vlastnost ani nevyjadřuje děj. Jen spojuje dvě věty a ukazuje, jaký je mezi nimi vztah: přidání, protiklad, výběr, důvod, čas či účel. Zkus každou možnost postavit doprostřed mezi dvě věty — u slova „${d3.slovo}“ to nepůjde vůbec.`,
      ],
      explanation: `Tohle slovo ${VYZNAM[s]} — samo o sobě nic nepojmenovává, jen spojuje dvě věty. Právě to dělá spojku spojkou. Zbylé tři možnosti jsou slova, která něco pojmenovávají, popisují nebo vyjadřují děj.`,
    },
  );
}

function najdiNespojku([n, d1, d2, d3]: [Nespojka, string, string, string]): PracticeTask {
  return choice(
    "Které z těchto slov NENÍ spojka?",
    n.slovo,
    [
      { value: d1, why: `„${d1}“ je spojka — ${VYZNAM[d1]}.` },
      { value: d2, why: `„${d2}“ je spojka — ${VYZNAM[d2]}.` },
      { value: d3, why: `„${d3}“ je spojka — ${VYZNAM[d3]}.` },
    ],
    {
      hints: [
        `Slova „${d1}“ i „${d2}“ dokážou postavit dvě věty vedle sebe. Hledej to jediné, které něco pojmenovává či popisuje.`,
        `Zkus každou možnost dosadit doprostřed dvou vět: „Byla zima ___ svítilo slunce.“ Tři možnosti tam budou dávat smysl, protože ukazují vztah mezi větami. Jedna tam nepůjde vůbec — a právě ta spojkou není. U slova „${d3}“ si tenhle test vyzkoušej jako první.`,
      ],
      explanation: `Tohle slovo je ${n.druh} — patří dovnitř věty, ne mezi dvě věty. Zbylé tři možnosti jsou spojky, protože samy o sobě nic nepojmenovávají a jen ukazují vztah mezi větami.`,
    },
  );
}

// ── L2 · doplň spojku podle vztahu ──────────────────────────────────────────

interface DoplnItem {
  veta: string;
  spravne: string;
  /** Doplní malou nápovědu: „Zeptej se: …“ */
  otazka: string;
  /** Doplní zpětnou vazbu a vysvětlení. */
  vztah: string;
  chybne: [string, string, string];
}

const DOPLN: DoplnItem[] = [
  {
    veta: "Nedošel jsem včas, ___ jsem zabloudil.", spravne: "protože",
    otazka: "z jakého důvodu jsem nedošel včas?",
    vztah: "druhá část vysvětluje důvod té první", chybne: ["ale", "nebo", "aby"],
  },
  {
    veta: "Chci, ___ ses naučil básničku.", spravne: "aby",
    otazka: "co si přeju, k čemu to celé směřuje?",
    vztah: "druhá část říká, co je cílem", chybne: ["protože", "ale", "nebo"],
  },
  {
    veta: "Chceš čaj, ___ raději kakao?", spravne: "nebo",
    otazka: "mám si z nabídky jedno vybrat?",
    vztah: "věta nabízí dvě možnosti na výběr", chybne: ["ale", "protože", "aby"],
  },
  {
    veta: "Petr se snažil ze všech sil, ___ závod nevyhrál.", spravne: "ale",
    otazka: "dopadlo to tak, jak bys po první části čekal?",
    vztah: "druhá část jde proti tomu, co bys po první čekal", chybne: ["protože", "nebo", "aby"],
  },
  {
    veta: "Zavolej mi, ___ přijedeš domů.", spravne: "až",
    otazka: "v jakém okamžiku mám zavolat?",
    vztah: "druhá část určuje, kdy se to má stát", chybne: ["ale", "nebo", "aby"],
  },
  {
    veta: "Zůstaneme doma, ___ bude pršet.", spravne: "když",
    otazka: "za jaké podmínky doma zůstaneme?",
    vztah: "druhá část říká podmínku, za které to platí", chybne: ["ale", "nebo", "aby"],
  },
  {
    veta: "Maminka vařila oběd ___ tatínek myl nádobí.", spravne: "a",
    otazka: "dělali oba něco proti sobě, nebo prostě každý své?",
    vztah: "druhá část jenom přidává další děj", chybne: ["ale", "protože", "aby"],
  },
  {
    veta: "Bál se tmy, ___ si v pokoji rozsvítil.", spravne: "takže",
    otazka: "co z toho strachu vzešlo?",
    vztah: "druhá část říká, co z první vyplynulo", chybne: ["ale", "nebo", "aby"],
  },
  {
    veta: "Slunce svítilo, ___ foukal studený vítr.", spravne: "ale",
    otazka: "hodí se obě zprávy k sobě, nebo si odporují?",
    vztah: "druhá část jde proti tomu, co bys po první čekal", chybne: ["protože", "aby", "až"],
  },
  {
    veta: "Kup rohlíky ___ chleba.", spravne: "a",
    otazka: "mám přinést obojí, nebo si vybrat?",
    vztah: "druhá část jenom přidává další věc k první", chybne: ["protože", "aby", "když"],
  },
  {
    veta: "Uvařím ti čaj, ___ ti bylo teplo.", spravne: "aby",
    otazka: "proč ten čaj vařím, čeho chci dosáhnout?",
    vztah: "druhá část říká, co je cílem", chybne: ["ale", "nebo", "až"],
  },
  {
    veta: "Tomáš doběhl první, ___ hodně trénoval.", spravne: "protože",
    otazka: "díky čemu doběhl první?",
    vztah: "druhá část vysvětluje důvod té první", chybne: ["ale", "nebo", "když"],
  },
  {
    veta: "Vezmi si buď svetr, ___ mikinu.", spravne: "nebo",
    otazka: "mám si vzít obojí naráz?",
    vztah: "slovo „buď“ na začátku ukazuje výběr ze dvou možností", chybne: ["ale", "protože", "když"],
  },
  {
    veta: "Zapomněl jsem klíče, ___ jsem se nedostal domů.", spravne: "takže",
    otazka: "co se stalo poté, co jsem klíče zapomněl?",
    vztah: "druhá část říká, co z první vyplynulo", chybne: ["nebo", "aby", "když"],
  },
];

function doplnUloha(it: DoplnItem): PracticeTask {
  const dist = it.chybne.map((d) => ({
    value: d,
    why: `Spojka „${d}“ ${VYZNAM[d]}. Jenže tady ${it.vztah}.`,
  })) as [Distractor, Distractor, Distractor];
  return choice(
    `Doplň do věty správnou spojku: „${it.veta}“`,
    it.spravne,
    dist,
    {
      hints: [
        `Zeptej se: ${it.otazka}`,
        `Nejdřív urči vztah mezi oběma částmi věty — může jít o přidání, protiklad, výběr, důvod, čas či účel. Tady platí, že ${it.vztah}. Teprve pak vyber to slovo, které přesně takový vztah vyjadřuje.`,
      ],
      explanation: `V téhle větě ${it.vztah}, a právě takový vztah doplněná spojka vyjadřuje. S kteroukoli jinou by věta tvrdila něco úplně jiného.`,
    },
  );
}

// ── L3 · spoj dvě věty a řekni totéž jinak ──────────────────────────────────

interface SpojItem {
  v1: string;
  v2: string;
  spravne: string;
  /** Doplní velkou nápovědu: „druhá věta je …“ */
  vztah: string;
  chybne: [Distractor, Distractor, Distractor];
}

const SPOJ: SpojItem[] = [
  {
    v1: "Bylo horko.", v2: "Šli jsme se koupat.",
    spravne: "Bylo horko, a proto jsme se šli koupat.",
    vztah: "následek toho, co říká ta první",
    chybne: [
      { value: "Bylo horko, protože jsme se šli koupat.", why: "Tahle věta tvrdí, že horko způsobilo koupání — příčina a následek jsou prohozené." },
      { value: "Bylo horko, ale šli jsme se koupat.", why: "„Ale“ by znamenalo, že koupání je proti očekávání. V horku se přitom koupat chodí úplně běžně." },
      { value: "Bylo horko, abychom se šli koupat.", why: "To by znamenalo, že horko nastalo schválně kvůli koupání." },
    ],
  },
  {
    v1: "Chtěl jsem si hrát.", v2: "Musel jsem se učit.",
    spravne: "Chtěl jsem si hrát, ale musel jsem se učit.",
    vztah: "opak toho, co by po první větě člověk čekal",
    chybne: [
      { value: "Chtěl jsem si hrát, protože jsem se musel učit.", why: "Učení není důvod, proč si chci hrát — obě části si spíš odporují." },
      { value: "Chtěl jsem si hrát, a proto jsem se musel učit.", why: "Z chuti hrát si povinnost učit se nevyplývá; jedno druhému překáží." },
      { value: "Chtěl jsem si hrát, abych se musel učit.", why: "Nikdo si nepřeje hrát si proto, aby se musel učit." },
    ],
  },
  {
    v1: "Půjdeme do kina.", v2: "Zůstaneme doma.",
    spravne: "Půjdeme do kina, nebo zůstaneme doma.",
    vztah: "jedna z možností, mezi kterými si vybíráš",
    chybne: [
      { value: "Půjdeme do kina, protože zůstaneme doma.", why: "Zůstat doma není důvod, proč jít do kina — obojí najednou udělat nejde." },
      { value: "Půjdeme do kina, ale zůstaneme doma.", why: "Tahle věta tvrdí obě věci zároveň, a to nejde; jde přece o výběr." },
      { value: "Půjdeme do kina, abychom zůstali doma.", why: "Do kina se nechodí kvůli tomu, aby se zůstalo doma." },
    ],
  },
  {
    v1: "Petr maloval obrázek.", v2: "Anna psala dopis.",
    spravne: "Petr maloval obrázek a Anna psala dopis.",
    vztah: "další děj, který se odehrál vedle toho prvního",
    chybne: [
      { value: "Petr maloval obrázek, ale Anna psala dopis.", why: "„Ale“ staví věty proti sobě, jenže tady si dvě klidné činnosti nijak neodporují." },
      { value: "Petr maloval obrázek, protože Anna psala dopis.", why: "Psaní dopisu není důvod, proč Petr maloval." },
      { value: "Petr maloval obrázek, aby Anna psala dopis.", why: "Petr nemaloval kvůli tomu, aby Anna psala." },
    ],
  },
  {
    v1: "Nestihli jsme autobus.", v2: "Šli jsme pěšky.",
    spravne: "Nestihli jsme autobus, a proto jsme šli pěšky.",
    vztah: "následek toho, co říká ta první",
    chybne: [
      { value: "Nestihli jsme autobus, protože jsme šli pěšky.", why: "Chůze nebyla důvod, proč nám autobus ujel — je to přesně naopak." },
      { value: "Nestihli jsme autobus, ale šli jsme pěšky.", why: "„Ale“ by naznačovalo, že chůze je překvapení. Po zmeškaném autobusu je ale čekaná." },
      { value: "Nestihli jsme autobus, abychom šli pěšky.", why: "Autobus nám neujel schválně kvůli tomu, abychom šli pěšky." },
    ],
  },
  {
    v1: "Vezmi si čepici.", v2: "Nenastydneš.",
    spravne: "Vezmi si čepici, abys nenastydl.",
    vztah: "cíl, kvůli kterému se to z první věty dělá",
    chybne: [
      { value: "Vezmi si čepici, protože nenastydneš.", why: "Věta obrací účel v důvod — čepice se nasazuje předem, teprve aby k nastydnutí nedošlo." },
      { value: "Vezmi si čepici, ale nenastydneš.", why: "Mezi čepicí a zdravím žádný protiklad není." },
      { value: "Vezmi si čepici, nebo nenastydneš.", why: "„Nebo“ dává na výběr, jenže tady se nevybírá mezi dvěma možnostmi." },
    ],
  },
  {
    v1: "Přišel domů.", v2: "Hned šel spát.",
    spravne: "Přišel domů a hned šel spát.",
    vztah: "další děj, který navazuje na ten první",
    chybne: [
      { value: "Přišel domů, ale hned šel spát.", why: "Spánek po návratu domů není nic překvapivého, takže protiklad tu chybí." },
      { value: "Přišel domů, protože hned šel spát.", why: "Spaní není důvod, proč přišel domů — obrátilo by to pořadí událostí." },
      { value: "Přišel domů, aby hned šel spát.", why: "Tahle věta by tvrdila, že se vracel jen kvůli spaní, což první věta neříká." },
    ],
  },
  {
    v1: "Učila se celý večer.", v2: "Test jí nevyšel.",
    spravne: "Učila se celý večer, ale test jí nevyšel.",
    vztah: "opak toho, co by po první větě člověk čekal",
    chybne: [
      { value: "Učila se celý večer, protože jí test nevyšel.", why: "Neúspěch v testu přišel až potom, takže důvodem učení být nemohl." },
      { value: "Učila se celý večer, a proto jí test nevyšel.", why: "Z poctivého učení špatný výsledek nevyplývá — to je právě to překvapivé." },
      { value: "Učila se celý večer, aby jí test nevyšel.", why: "Nikdo se neučí proto, aby mu test nevyšel." },
    ],
  },
];

function spojUloha(it: SpojItem): PracticeTask {
  return choice(
    `Které souvětí správně spojí věty „${it.v1}“ a „${it.v2}“?`,
    it.spravne,
    it.chybne,
    {
      hints: [
        `Řekni si nahlas, co se mezi větami „${it.v1}“ a „${it.v2}“ děje: způsobila jedna druhou, jdou proti sobě, či si mezi nimi vybíráš?`,
        `Všechny čtyři možnosti jsou složené ze stejných slov, liší se jen spojkou — a ta mění celý smysl. Tady platí, že druhá věta je ${it.vztah}. Přečti si každou možnost nahlas a zeptej se, jestli tvrdí přesně tohle.`,
      ],
      explanation: `Druhá věta je ${it.vztah}, a tenhle vztah umí vyjádřit jen jedna z nabízených spojek. Ostatní možnosti sice znějí podobně, ale tvrdí něco jiného.`,
    },
  );
}

interface JinakItem {
  veta: string;
  spravne: string;
  /** Co je v původní větě příčina (jde do velké nápovědy). */
  pricina: string;
  chybne: [Distractor, Distractor, Distractor];
}

const JINAK: JinakItem[] = [
  {
    veta: "Foukalo, a proto jsme se vrátili.", spravne: "Vrátili jsme se, protože foukalo.",
    pricina: "vítr",
    chybne: [
      { value: "Foukalo, protože jsme se vrátili.", why: "Tady se příčina a následek prohodily — vítr přece nezačal kvůli našemu návratu." },
      { value: "Vrátili jsme se, když foukalo.", why: "Tahle věta říká jen to, KDY jsme se vrátili, ne PROČ." },
      { value: "Vrátili jsme se, ale foukalo.", why: "„Ale“ z obou částí dělá protiklad, jenže v původní větě jedna z druhé vyplývá." },
    ],
  },
  {
    veta: "Zaspal jsem, a proto jsem přišel pozdě.", spravne: "Přišel jsem pozdě, protože jsem zaspal.",
    pricina: "zaspání",
    chybne: [
      { value: "Zaspal jsem, protože jsem přišel pozdě.", why: "Prohozené role: pozdní příchod nemohl způsobit, že jsem zaspal." },
      { value: "Přišel jsem pozdě, když jsem zaspal.", why: "Tahle věta určuje čas, ale důvod pozdního příchodu z ní nezazní." },
      { value: "Přišel jsem pozdě, ale zaspal jsem.", why: "Obě části tu stojí proti sobě, přestože jedna z druhé vyplývá." },
    ],
  },
  {
    veta: "Bolelo mě v krku, a proto jsem zůstal doma.", spravne: "Zůstal jsem doma, protože mě bolelo v krku.",
    pricina: "bolest v krku",
    chybne: [
      { value: "Bolelo mě v krku, protože jsem zůstal doma.", why: "Doma nikdo v krku nerozbolí — příčina a následek jsou prohozené." },
      { value: "Zůstal jsem doma, když mě bolelo v krku.", why: "Věta říká, kdy jsem doma zůstal, ale důvod nevysvětluje." },
      { value: "Zůstal jsem doma, ale bolelo mě v krku.", why: "Z původní věty žádný protiklad nevyplývá; jedno vede k druhému." },
    ],
  },
  {
    veta: "Protože svítilo slunce, šli jsme na výlet.", spravne: "Svítilo slunce, a proto jsme šli na výlet.",
    pricina: "sluneční počasí",
    chybne: [
      { value: "Šli jsme na výlet, a proto svítilo slunce.", why: "Prohozené role: slunce nezačalo svítit kvůli našemu výletu." },
      { value: "Svítilo slunce, ale šli jsme na výlet.", why: "„Ale“ by naznačovalo, že výlet je navzdory počasí — jenže počasí bylo právě tím důvodem." },
      { value: "Svítilo slunce, když jsme šli na výlet.", why: "Tahle věta popisuje jen čas výletu, ne jeho důvod." },
    ],
  },
  {
    veta: "Protože pršelo, hráli jsme doma.", spravne: "Pršelo, a proto jsme hráli doma.",
    pricina: "déšť",
    chybne: [
      { value: "Hráli jsme doma, a proto pršelo.", why: "Déšť naší hrou nezpůsobíme — role se prohodily." },
      { value: "Pršelo, ale hráli jsme doma.", why: "Hra doma je v dešti čekaná, takže protiklad tu není." },
      { value: "Pršelo, když jsme hráli doma.", why: "Tahle věta říká jen to, že obojí bylo zároveň, ne že jedno způsobilo druhé." },
    ],
  },
  {
    veta: "Nestihli jsme vlak, a proto jsme jeli autobusem.", spravne: "Jeli jsme autobusem, protože jsme nestihli vlak.",
    pricina: "zmeškaný vlak",
    chybne: [
      { value: "Nestihli jsme vlak, protože jsme jeli autobusem.", why: "Prohozené role: autobus jsme si vybrali až potom, co nám vlak ujel." },
      { value: "Jeli jsme autobusem, když jsme nestihli vlak.", why: "Věta udává okamžik, ale neříká, že vlak byl tím důvodem." },
      { value: "Jeli jsme autobusem, ale nestihli jsme vlak.", why: "Obě části tu stojí proti sobě, přestože jedna z druhé vyplývá." },
    ],
  },
];

function jinakUloha(it: JinakItem): PracticeTask {
  return choice(
    `Věta „${it.veta}“ — kterou z nabízených vět se dá říct úplně totéž?`,
    it.spravne,
    it.chybne,
    {
      hints: [
        `Ve větě „${it.veta}“ najdi, co se stalo dřív a co z toho vzešlo. V nové větě musí zůstat obojí ve stejné roli.`,
        `Tady je příčinou ${it.pricina} — a příčina zůstane příčinou, i když se obě části prohodí a použije se jiná spojka. Každou možnost si proto přečti a ověř, jestli pořád říká totéž o tom, co z čeho vyplynulo.`,
      ],
      explanation: `Souvětí říká totéž jen tehdy, když zůstane stejné, co je příčina (${it.pricina}) a co následek — prohodit se smí jen pořadí obou částí a spojka. Ostatní možnosti buď role prohodily, nebo z příčiny udělaly pouhý čas či protiklad.`,
    },
  );
}

// ── Generátor ───────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle([...NAJDI_SPOJKU.map(najdiSpojku), ...NAJDI_NESPOJKU.map(najdiNespojku)]);
  if (level === 2) return shuffle(DOPLN.map(doplnUloha));
  return shuffle([...SPOJ.map(spojUloha), ...JINAK.map(jinakUloha)]);
}

export const SPOJOVANIVETSPOJKAMI: TopicMetadata[] = [
  {
    id: "g3-cjl-spojovani-vet-spojkami",
    rvpNodeId: "g3-cjl-jazykova-vychova-skladba-spojovani-vet-spojkami-a-spojovacimi-vyrazy",
    title: "Spojování vět spojkami a spojovacími výrazy",
    studentTitle: "Spojky ve větách",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Naučíš se spojovat věty pomocí správných spojek.",
    keywords: ["spojka", "a", "ale", "nebo", "protože", "když", "aby", "souvětí"],
    goals: ["Rozpoznat spojku ve větě.", "Vybrat správnou spojku pro spojení vět.", "Pochopit, co různé spojky vyjadřují."],
    boundaries: ["Základní spojky: a, ale, nebo, protože, když, aby, až, takže."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Spojky: a (přidávám), ale (protiklad), nebo (výběr), protože (příčina), když (čas nebo podmínka).",
      steps: ["Přečti obě věty.", "Urči, jaký je mezi nimi vztah (protiklad, příčina, výběr…).", "Vyber odpovídající spojku."],
      commonMistake: "„Šel ven, ale pršelo.“ (protiklad) × „Šel ven, protože bylo hezky.“ (příčina).",
      example: "Bylo teplo, a proto jsme šli plavat. → „a proto“ = důsledek.",
    },
  },
];
