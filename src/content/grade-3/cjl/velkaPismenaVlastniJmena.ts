import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pluralWithNumber } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "../_shared";

/**
 * Přepsáno 2026-09-12 (inventura obsahu, dávka g3cjl-a).
 *
 * Předtím: možnosti se lišily jen velikostí písmen (Praha / praha / PRAHA),
 * takže se nedaly odlišit jinak než opticky, zpětná vazba u chybných možností
 * chyběla úplně a malá nápověda byla u 26 úloh stejná.
 *
 * Teď tři disjunktní banky:
 *   L1 — rozpoznání pravidla: proč TOHLE slovo ve větě velké (malé) písmeno má.
 *   L2 — aplikace: u samostatného slova rozhodnout, jestli velké písmeno patří.
 *        Slova se citují VERZÁLKAMI, aby odpověď nebyla vidět předem.
 *   L3 — transfer: dvě pravidla najednou (začátek věty + vlastní jména) a
 *        víceslovné názvy, kde velké písmeno dostane jen část názvu.
 *
 * Každá úloha má vlastní dvojici nápověd, vysvětlení PROČ a zpětnou vazbu
 * u každé chybné možnosti.
 */

// ── L1 · proč se to slovo píše velkým / malým písmenem ──────────────────────

interface VelkeItem {
  veta: string;
  /** Tvar slova tak, jak stojí ve větě. */
  slovo: string;
  /** Doplní klíč: „Je to jméno …“ */
  jmeno: string;
  /** Doplní nápovědu: „pojmenovává …“ */
  jednu: string;
  /** Doplní nápovědu: „nebo …“ */
  kazdou: string;
  /** Chybný důvod „každá řeka se píše velkým“ — celá věta. */
  prehnane: string;
  /** Vysvětlení, proč přehnané pravidlo neplatí. */
  prehnaneProc: string;
  /** Obecné podstatné jméno z téže věty (píše se malým). */
  obecne: string;
  /** První slovo věty. */
  prvni: string;
}

const VELKE: VelkeItem[] = [
  {
    veta: "Pod starým mostem teče Berounka.", slovo: "Berounka", jmeno: "jedné určité řeky",
    jednu: "jednu jedinou řeku", kazdou: "každou řeku na světě",
    prehnane: "Každá řeka se píše s velkým písmenem.",
    prehnaneProc: "Slovo „řeka“ se píše s malým ř — velké dostane jen jméno té konkrétní.",
    obecne: "mostem", prvni: "Pod",
  },
  {
    veta: "Nejvyšší českou horou je Sněžka.", slovo: "Sněžka", jmeno: "jedné určité hory",
    jednu: "jednu jedinou horu", kazdou: "kterýkoli kopec",
    prehnane: "Každá hora se píše s velkým písmenem.",
    prehnaneProc: "Slovo „hora“ se píše s malým h — velké dostane jen jméno té konkrétní.",
    obecne: "horou", prvni: "Nejvyšší",
  },
  {
    veta: "V sobotu jsme s Adamem plavali v rybníce.", slovo: "Adamem", jmeno: "jednoho člověka",
    jednu: "jednoho určitého kluka", kazdou: "kohokoli",
    prehnane: "Jsou v něm dvě slabiky.",
    prehnaneProc: "Slabiky jsou tři (A-da-mem) — a hlavně, na jejich počtu vůbec nezáleží.",
    obecne: "rybníce", prvni: "V",
  },
  {
    veta: "Naše město Olomouc leží na Moravě.", slovo: "Olomouc", jmeno: "jednoho určitého města",
    jednu: "jedno jediné město", kazdou: "kterékoli město",
    prehnane: "Každé město se píše s velkým písmenem.",
    prehnaneProc: "Slovo „město“ se píše s malým m — velké dostane jen jméno toho konkrétního.",
    obecne: "město", prvni: "Naše",
  },
  {
    veta: "Do školy chodí i Klára z vedlejšího domu.", slovo: "Klára", jmeno: "jednoho člověka",
    jednu: "jednu určitou holku", kazdou: "kteroukoli holku",
    prehnane: "Je to nejdelší slovo ve větě.",
    prehnaneProc: "Nejdelší slovo je „vedlejšího“ a velké písmeno nemá; na délce vůbec nezáleží.",
    obecne: "školy", prvni: "Do",
  },
  {
    veta: "Nad vesnicí se tyčí Radhošť.", slovo: "Radhošť", jmeno: "jedné určité hory",
    jednu: "jednu jedinou horu", kazdou: "jakýkoli vrchol",
    prehnane: "Každý kopec se píše s velkým písmenem.",
    prehnaneProc: "Slovo „kopec“ se píše s malým k — velké dostane jen jméno toho konkrétního.",
    obecne: "vesnicí", prvni: "Nad",
  },
  {
    veta: "V zimě jezdíme lyžovat do Ostravy.", slovo: "Ostravy", jmeno: "jednoho určitého města",
    jednu: "jedno jediné město", kazdou: "libovolné město",
    prehnane: "Každá zima se píše s velkým písmenem.",
    prehnaneProc: "Slovo „zimě“ stojí ve stejné větě a velké písmeno nemá — roční doby se píšou malým.",
    obecne: "zimě", prvni: "V",
  },
  {
    veta: "Naše vesnice leží u řeky Labe.", slovo: "Labe", jmeno: "jedné určité řeky",
    jednu: "jednu jedinou řeku", kazdou: "kteroukoli vodu",
    prehnane: "Každá vesnice se píše s velkým písmenem.",
    prehnaneProc: "Slovo „vesnice“ stojí ve stejné větě a velké písmeno nemá.",
    obecne: "řeky", prvni: "Naše",
  },
  {
    veta: "Na výletě jsme vystoupali na Praděd.", slovo: "Praděd", jmeno: "jedné určité hory",
    jednu: "jednu jedinou horu", kazdou: "jakýkoli kopec v okolí",
    prehnane: "Každý výlet se píše s velkým písmenem.",
    prehnaneProc: "Slovo „výlet“ se píše s malým v, i když je ve stejné větě.",
    obecne: "výletě", prvni: "Na",
  },
];

function velkeUloha(it: VelkeItem): PracticeTask {
  const spravne = `Je to jméno ${it.jmeno}.`;
  return choice(
    `Proč se ve větě „${it.veta}“ píše slovo „${it.slovo}“ s velkým písmenem?`,
    spravne,
    [
      { value: "Je to podstatné jméno.", why: `Podstatné jméno je i slovo „${it.obecne}“ z téže věty, a přesto začíná malým písmenem.` },
      { value: "Stojí na začátku věty.", why: `Na začátku věty stojí „${it.prvni}“ — o tohle slovo tu nejde.` },
      { value: it.prehnane, why: it.prehnaneProc },
    ],
    {
      hints: [
        `Rozhodni, jestli „${it.slovo}“ pojmenovává ${it.jednu}, nebo ${it.kazdou}.`,
        `Vlastní jméno patří jen jedné osobě, jednomu městu, jedné řece či hoře — a začíná velkým písmenem. Obecné slovo (třeba „${it.obecne}“ ve stejné větě) platí pro celý druh, a proto zůstává malé. Zeptej se tedy, do které z těch dvou skupin „${it.slovo}“ patří.`,
      ],
      explanation: `Slovo „${it.slovo}“ pojmenovává ${it.jednu} — je to vlastní jméno, a ta se vždy píšou s velkým počátečním písmenem. Zbytek věty (třeba „${it.obecne}“) platí pro celý druh, a proto zůstává malý.`,
    },
  );
}

interface MaleItem {
  veta: string;
  slovo: string;
  /** Doplní nápovědu: „patří …“ */
  jedne: string;
  /** Doplní chybnou možnost: „Jméno žádné/žádného … se nepíše s velkým písmenem.“ */
  zadne: string;
  /** Vlastní jméno téhož druhu — ukazuje, že přehnané pravidlo neplatí. */
  priklad: string;
}

const MALE: MaleItem[] = [
  { veta: "Pod naším oknem teče malá řeka.", slovo: "řeka", jedne: "jedné jediné řece", zadne: "žádné řeky", priklad: "Vltava" },
  { veta: "Za vesnicí stojí vysoká hora.", slovo: "hora", jedne: "jedné jediné hoře", zadne: "žádné hory", priklad: "Sněžka" },
  { veta: "Naproti nám bydlí hodný soused.", slovo: "soused", jedne: "jednomu jedinému člověku", zadne: "žádného člověka", priklad: "Adam" },
  { veta: "Naše město má krásné náměstí.", slovo: "město", jedne: "jednomu jedinému městu", zadne: "žádného města", priklad: "Plzeň" },
  { veta: "V lese jsme viděli plaché zvíře.", slovo: "zvíře", jedne: "jednomu jedinému zvířeti", zadne: "žádného zvířete", priklad: "Azor" },
  { veta: "Do školy chodí i můj kamarád.", slovo: "kamarád", jedne: "jednomu jedinému klukovi", zadne: "žádného kluka", priklad: "Martin" },
];

function maleUloha(it: MaleItem): PracticeTask {
  return choice(
    `Proč se ve větě „${it.veta}“ píše slovo „${it.slovo}“ s malým písmenem?`,
    "Je to obecné jméno — platí pro celý druh.",
    [
      { value: "Není to podstatné jméno.", why: `Podstatné jméno to je — pojmenovává věc nebo bytost. O velikosti prvního písmene ale rozhoduje něco jiného.` },
      { value: "Je to krátké slovo.", why: `Na délce nezáleží: „${it.priklad}“ je taky krátké a velké písmeno má.` },
      { value: `Jméno ${it.zadne} se nikdy nepíše s velkým písmenem.`, why: `Nepravda — „${it.priklad}“ velké písmeno má, protože je to jméno jednoho určitého.` },
    ],
    {
      hints: [
        `Zeptej se, jestli slovo „${it.slovo}“ patří ${it.jedne}, nebo jich takových může být spousta.`,
        `Velké písmeno dostane jméno, které patří jen jedné osobě, jednomu městu, jedné řece či hoře — třeba „${it.priklad}“. Slovo, kterým se dá pojmenovat celá skupina, zůstává malé. Zkus tedy říct, kolik různých věcí nebo bytostí se dá slovem „${it.slovo}“ pojmenovat.`,
      ],
      explanation: `Slovem „${it.slovo}“ se dá pojmenovat celý druh, ne jen jeden jediný kus — proto je to obecné jméno a píše se malým písmenem. Kdyby ve větě stálo „${it.priklad}“, velké písmeno by tam patřilo.`,
    },
  );
}

// ── L2 · rozhodni u samostatného slova ──────────────────────────────────────
// Slova se citují VERZÁLKAMI: zápis pak neprozrazuje, jak se mají psát.

interface Vlastni { slovo: string; co: string }
interface Obecne { slovo: string; co: string }

const V: Record<string, Vlastni> = {
  BRNO: { slovo: "BRNO", co: "jméno jednoho určitého města" },
  VLTAVA: { slovo: "VLTAVA", co: "jméno jedné určité řeky" },
  SNĚŽKA: { slovo: "SNĚŽKA", co: "jméno jedné určité hory" },
  ADAM: { slovo: "ADAM", co: "jméno jednoho člověka" },
  KRKONOŠE: { slovo: "KRKONOŠE", co: "jméno jednoho určitého pohoří" },
  NOVÁKOVÁ: { slovo: "NOVÁKOVÁ", co: "příjmení jednoho člověka" },
  LABE: { slovo: "LABE", co: "jméno jedné určité řeky" },
  NĚMECKO: { slovo: "NĚMECKO", co: "jméno jednoho státu" },
  OSTRAVA: { slovo: "OSTRAVA", co: "jméno jednoho určitého města" },
  PLZEŇ: { slovo: "PLZEŇ", co: "jméno jednoho určitého města" },
  MORAVA: { slovo: "MORAVA", co: "jméno jedné určité řeky" },
  RADHOŠŤ: { slovo: "RADHOŠŤ", co: "jméno jedné určité hory" },
  PRADĚD: { slovo: "PRADĚD", co: "jméno jedné určité hory" },
  KLÁRA: { slovo: "KLÁRA", co: "jméno jednoho člověka" },
  ANIČKA: { slovo: "ANIČKA", co: "jméno jednoho člověka" },
  ŠUMAVA: { slovo: "ŠUMAVA", co: "jméno jednoho určitého pohoří" },
  BESKYDY: { slovo: "BESKYDY", co: "jméno jednoho určitého pohoří" },
  MARTIN: { slovo: "MARTIN", co: "jméno jednoho člověka" },
  PETR: { slovo: "PETR", co: "jméno jednoho člověka" },
  POLSKO: { slovo: "POLSKO", co: "jméno jednoho státu" },
  RAKOUSKO: { slovo: "RAKOUSKO", co: "jméno jednoho státu" },
};

const O: Record<string, Obecne> = {
  MĚSTO: { slovo: "MĚSTO", co: "platí pro každé město na světě" },
  VESNICE: { slovo: "VESNICE", co: "platí pro kteroukoli vesnici" },
  NÁMĚSTÍ: { slovo: "NÁMĚSTÍ", co: "platí pro každé náměstí" },
  ŘEKA: { slovo: "ŘEKA", co: "platí pro kteroukoli tekoucí vodu" },
  POTOK: { slovo: "POTOK", co: "platí pro každý potok" },
  RYBNÍK: { slovo: "RYBNÍK", co: "platí pro kterýkoli rybník" },
  HORA: { slovo: "HORA", co: "platí pro každou horu" },
  KOPEC: { slovo: "KOPEC", co: "platí pro kterýkoli kopec" },
  ÚDOLÍ: { slovo: "ÚDOLÍ", co: "platí pro každé údolí" },
  CHLAPEC: { slovo: "CHLAPEC", co: "platí pro kteréhokoli kluka" },
  SOUSED: { slovo: "SOUSED", co: "platí pro každého souseda" },
  KAMARÁD: { slovo: "KAMARÁD", co: "platí pro kteréhokoli kamaráda" },
  POHOŘÍ: { slovo: "POHOŘÍ", co: "platí pro každé pohoří" },
  LOUKA: { slovo: "LOUKA", co: "platí pro kteroukoli louku" },
  LES: { slovo: "LES", co: "platí pro každý les" },
  UČITELKA: { slovo: "UČITELKA", co: "platí pro kteroukoli učitelku" },
  PANÍ: { slovo: "PANÍ", co: "platí pro kteroukoli dospělou ženu" },
  TETA: { slovo: "TETA", co: "platí pro každou tetu" },
  PŘÍSTAV: { slovo: "PŘÍSTAV", co: "platí pro každý přístav" },
  MOST: { slovo: "MOST", co: "platí pro kterýkoli most" },
  PŘÍTOK: { slovo: "PŘÍTOK", co: "platí pro každý přítok" },
  STÁT: { slovo: "STÁT", co: "platí pro kterýkoli stát" },
  HRANICE: { slovo: "HRANICE", co: "platí pro každou hranici mezi státy" },
  VLAJKA: { slovo: "VLAJKA", co: "platí pro kteroukoli vlajku" },
  DÍVKA: { slovo: "DÍVKA", co: "platí pro kteroukoli holku" },
};

const NAJDI_VELKE: [Vlastni, Obecne, Obecne, Obecne][] = [
  [V.BRNO, O.MĚSTO, O.VESNICE, O.NÁMĚSTÍ],
  [V.VLTAVA, O.ŘEKA, O.POTOK, O.RYBNÍK],
  [V.SNĚŽKA, O.HORA, O.KOPEC, O.ÚDOLÍ],
  [V.ADAM, O.CHLAPEC, O.SOUSED, O.KAMARÁD],
  [V.KRKONOŠE, O.POHOŘÍ, O.LOUKA, O.LES],
  [V.NOVÁKOVÁ, O.UČITELKA, O.PANÍ, O.TETA],
  [V.LABE, O.PŘÍSTAV, O.MOST, O.PŘÍTOK],
  [V.NĚMECKO, O.STÁT, O.HRANICE, O.VLAJKA],
];

const NAJDI_MALE: [Obecne, Vlastni, Vlastni, Vlastni][] = [
  [O.ŘEKA, V.VLTAVA, V.LABE, V.MORAVA],
  [O.MĚSTO, V.BRNO, V.OSTRAVA, V.PLZEŇ],
  [O.HORA, V.SNĚŽKA, V.RADHOŠŤ, V.PRADĚD],
  [O.DÍVKA, V.KLÁRA, V.ANIČKA, V.NOVÁKOVÁ],
  [O.POHOŘÍ, V.KRKONOŠE, V.ŠUMAVA, V.BESKYDY],
  [O.SOUSED, V.ADAM, V.MARTIN, V.PETR],
  [O.STÁT, V.NĚMECKO, V.POLSKO, V.RAKOUSKO],
];

function najdiVelke([v, d1, d2, d3]: [Vlastni, Obecne, Obecne, Obecne]): PracticeTask {
  return choice(
    "Které z těchto slov se musí psát s velkým počátečním písmenem?",
    v.slovo,
    [
      { value: d1.slovo, why: `„${d1.slovo}“ ${d1.co} — pojmenovává celý druh, a proto se píše s malým písmenem.` },
      { value: d2.slovo, why: `„${d2.slovo}“ ${d2.co} — pojmenovává celý druh, a proto se píše s malým písmenem.` },
      { value: d3.slovo, why: `„${d3.slovo}“ ${d3.co} — pojmenovává celý druh, a proto se píše s malým písmenem.` },
    ],
    {
      hints: [
        `Slova „${d1.slovo}“ i „${d2.slovo}“ platí pro celý druh. Najdi to jediné, které patří jen jednomu.`,
        `Velké počáteční písmeno dostane jen pojmenování, které patří jedné osobě, jednomu městu, jedné řece či hoře. Slovo, kterým se dá pojmenovat spousta různých věcí (jako „${d3.slovo}“), zůstává malé — a taková jsou tady tři.`,
      ],
      explanation: `Tohle slovo je ${v.co} — je to vlastní jméno, a to se vždy píše s velkým počátečním písmenem. Zbylé tři možnosti pojmenovávají celý druh, takže zůstávají malé.`,
    },
  );
}

function najdiMale([o, d1, d2, d3]: [Obecne, Vlastni, Vlastni, Vlastni]): PracticeTask {
  return choice(
    "Které z těchto slov se píše s malým počátečním písmenem?",
    o.slovo,
    [
      { value: d1.slovo, why: `„${d1.slovo}“ je ${d1.co}, a proto začíná velkým ${d1.slovo[0]}.` },
      { value: d2.slovo, why: `„${d2.slovo}“ je ${d2.co}, a proto začíná velkým ${d2.slovo[0]}.` },
      { value: d3.slovo, why: `„${d3.slovo}“ je ${d3.co}, a proto začíná velkým ${d3.slovo[0]}.` },
    ],
    {
      hints: [
        `Pojmenování „${d1.slovo}“ i „${d2.slovo}“ patří vždycky jen jednomu. Najdi to jediné slovo, které platí pro celý druh.`,
        `Zkus u každé možnosti říct, kolik různých věcí nebo bytostí se tak dá pojmenovat. Když je jich mnoho, zůstává počáteční písmeno malé; pojmenování jako „${d3.slovo}“ patří jen jednomu, a proto začíná velkým.`,
      ],
      explanation: `Tohle slovo ${o.co} — je to obecné jméno, a ta se píšou s malým počátečním písmenem. Zbylé tři možnosti jsou vlastní jména jednoho určitého místa nebo člověka, takže velké písmeno mají.`,
    },
  );
}

// ── L3 · dvě pravidla najednou a víceslovné názvy ───────────────────────────

interface PocetItem {
  /** Věta zapsaná schválně bez velkých písmen. */
  veta: string;
  /** Slova, která velké písmeno potřebují — ve správném tvaru. */
  velka: string[];
  /** Obecné podstatné jméno z věty (zůstává malé). */
  obecne: string;
  /** Chybné počty. */
  chybne: [number, number, number];
}

const POCTY: PocetItem[] = [
  { veta: "naše kočka micka spí na židli", velka: ["Naše", "Micka"], obecne: "kočka", chybne: [1, 3, 4] },
  { veta: "zítra navštívíme hrad karlštejn", velka: ["Zítra", "Karlštejn"], obecne: "hrad", chybne: [1, 3, 4] },
  { veta: "řeka morava protéká městem olomouc", velka: ["Řeka", "Morava", "Olomouc"], obecne: "městem", chybne: [2, 4, 1] },
  { veta: "babička bydlí u lesa", velka: ["Babička"], obecne: "lesa", chybne: [2, 3, 4] },
  { veta: "jedeme na výlet do krkonoš s martinem", velka: ["Jedeme", "Krkonoš", "Martinem"], obecne: "výlet", chybne: [2, 4, 1] },
  { veta: "adam, eliška a filip jedou vlakem do zlína", velka: ["Adam", "Eliška", "Filip", "Zlína"], obecne: "vlakem", chybne: [3, 5, 2] },
  { veta: "letos v květnu pojedeme do chorvatska", velka: ["Letos", "Chorvatska"], obecne: "květnu", chybne: [1, 3, 4] },
  { veta: "učitelka jana nováková nám dala úkol", velka: ["Učitelka", "Jana", "Nováková"], obecne: "úkol", chybne: [2, 4, 1] },
];

const pocetSlov = (n: number) => pluralWithNumber(n, "slovo", "slova", "slov");

function pocetUloha(it: PocetItem): PracticeTask {
  const n = it.velka.length;
  const seznam = it.velka.map((w) => `„${w}“`).join(", ");
  const dist = it.chybne.map((d) => ({
    value: pocetSlov(d),
    why: d < n
      ? `Je jich víc — velké písmeno tu potřebují ${seznam}.`
      : `Je jich méně — velké písmeno tu potřebují jen ${seznam}.`,
  })) as [Distractor, Distractor, Distractor];
  return choice(
    `Věta je schválně napsaná bez velkých písmen: „${it.veta}“. Kolik slov v ní musí začínat velkým písmenem?`,
    pocetSlov(n),
    dist,
    {
      hints: [
        `Projdi větu „${it.veta}“ slovo po slovu a nezapomeň na to úplně první.`,
        `Velké písmeno dostane první slovo věty a pak každé jméno, které patří jen jedné osobě, jednomu městu, jedné řece či hoře. Slova jako „${it.obecne}“ platí pro celý druh a zůstávají malá — a stejně tak názvy dnů a měsíců.`,
      ],
      explanation: `Velkým písmenem začíná první slovo věty a každé vlastní jméno. Tady jsou to ${seznam}, dohromady tedy ${pocetSlov(n)}. Slovo „${it.obecne}“ platí pro celý druh, a proto zůstává malé.`,
    },
  );
}

interface NazevItem {
  /** Zadání otázky — název se cituje VERZÁLKAMI. */
  otazka: string;
  spravne: string;
  chybne: [Distractor, Distractor, Distractor];
  /** Doplní malou nápovědu: „Zeptej se, které slovo …“ */
  vodítko: string;
  /** Doplní vysvětlení. */
  proc: string;
  /** Obě slova názvu — jde do velké nápovědy. */
  dvojice: string;
  /** Obě slova názvu — jde do velké nápovědy. */
}

const PRVNI = "jen v prvním slově";
const DRUHE = "jen ve druhém slově";
const OBE = "v obou slovech";
const ZADNE = "ani v jednom slově";

const NAZVY: NazevItem[] = [
  {
    otazka: "V názvu pohoří „ORLICKÉ HORY“ se velké písmeno píše:",
    spravne: PRVNI,
    chybne: [
      { value: DRUHE, why: "Slovo „hory“ jen říká, o jaký útvar jde — platí pro každé hory, a tak zůstává malé." },
      { value: OBE, why: "Obě velká písmena by tam byla jen tehdy, kdyby i druhé slovo bylo jméno; „hory“ jménem není." },
      { value: ZADNE, why: "Je to název jednoho určitého pohoří, takže jedno velké písmeno tam patřit musí." },
    ],
    vodítko: "které z obou slov říká, KTERÉ hory to jsou, a které jen to, že jde o hory",
    proc: "rozlišující je první slovo — druhé slovo pojmenovává celý druh a zůstává malé",
    dvojice: "„ORLICKÉ“ a „HORY“",
  },
  {
    otazka: "V názvu ulice „ULICE KARLOVA“ se velké písmeno píše:",
    spravne: DRUHE,
    chybne: [
      { value: PRVNI, why: "Slovo „ulice“ platí pro každou ulici ve městě, a proto se píše s malým u." },
      { value: OBE, why: "Velké písmeno dostane jen ta část, která ulici odlišuje od ostatních — a to není slovo „ulice“." },
      { value: ZADNE, why: "Je to název jedné určité ulice, takže jedno velké písmeno tam patří." },
    ],
    vodítko: "které z obou slov odlišuje tuhle ulici od všech ostatních ulic",
    proc: "slovo „ulice“ platí pro každou ulici, kdežto druhé slovo říká, o kterou jde",
    dvojice: "„ULICE“ a „KARLOVA“",
  },
  {
    otazka: "V názvu stavby „KARLŮV MOST“ se velké písmeno píše:",
    spravne: PRVNI,
    chybne: [
      { value: DRUHE, why: "Slovo „most“ platí pro každý most na světě, a tak zůstává malé." },
      { value: OBE, why: "Druhé slovo jen říká, o jakou stavbu jde; jménem mostu je to první." },
      { value: ZADNE, why: "Je to název jedné určité stavby v Praze, takže bez velkého písmene se neobejde." },
    ],
    vodítko: "které z obou slov říká, že jde právě o tenhle most, a ne o kterýkoli jiný",
    proc: "první slovo je odvozené od jména Karel a odlišuje tenhle most od všech ostatních",
    dvojice: "„KARLŮV“ a „MOST“",
  },
  {
    otazka: "V názvu „NÁMĚSTÍ MÍRU“ se velké písmeno píše:",
    spravne: DRUHE,
    chybne: [
      { value: PRVNI, why: "Slovo „náměstí“ platí pro každé náměstí, a proto se píše s malým n." },
      { value: OBE, why: "První slovo jen pojmenovává druh místa; odlišující je až to druhé." },
      { value: ZADNE, why: "Je to název jednoho určitého náměstí, takže jedno velké písmeno tam být musí." },
    ],
    vodítko: "které z obou slov by ses zeptal, když chceš vědět, KTERÉ náměstí to je",
    proc: "obecné slovo „náměstí“ zůstává malé a odlišující část názvu se píše velkým písmenem",
    dvojice: "„NÁMĚSTÍ“ a „MÍRU“",
  },
  {
    otazka: "V názvu města „ČESKÉ BUDĚJOVICE“ se velké písmeno píše:",
    spravne: OBE,
    chybne: [
      { value: PRVNI, why: "Druhé slovo není obecné pojmenování druhu — je to část jména toho města." },
      { value: DRUHE, why: "První slovo k tomu jménu neoddělitelně patří, takže malé zůstat nemůže." },
      { value: ZADNE, why: "Jde o jméno jednoho určitého města, a to se bez velkých písmen nepíše." },
    ],
    vodítko: "jestli je některé z těch dvou slov obecné pojmenování druhu, jako „hory“ nebo „ulice“",
    proc: "žádné z obou slov není obecné pojmenování druhu — obě patří do jména města",
    dvojice: "„ČESKÉ“ a „BUDĚJOVICE“",
  },
  {
    otazka: "V názvu města „HRADEC KRÁLOVÉ“ se velké písmeno píše:",
    spravne: OBE,
    chybne: [
      { value: PRVNI, why: "Druhé slovo tu není obecné — je to pevná součást jména toho města." },
      { value: DRUHE, why: "První slovo jméno města začíná, a proto malé zůstat nemůže." },
      { value: ZADNE, why: "Jméno jednoho určitého města se vždycky píše s velkým písmenem." },
    ],
    vodítko: "jestli by některé z těch dvou slov šlo použít pro kterékoli jiné město",
    proc: "obě slova dohromady tvoří jméno jednoho určitého města, takže velké písmeno má každé z nich",
    dvojice: "„HRADEC“ a „KRÁLOVÉ“",
  },
  {
    otazka: "V názvu našeho státu „ČESKÁ REPUBLIKA“ se velké písmeno píše:",
    spravne: PRVNI,
    chybne: [
      { value: DRUHE, why: "Slovo „republika“ platí pro spoustu států na světě, a tak zůstává malé." },
      { value: OBE, why: "Druhé slovo pojmenovává druh státního zřízení, ne jeden určitý stát." },
      { value: ZADNE, why: "Je to jméno jednoho určitého státu, takže jedno velké písmeno tam patří." },
    ],
    vodítko: "které z obou slov říká, o KTEROU republiku na světě jde",
    proc: "republik je na světě mnoho, takže druhé slovo zůstává malé a odlišuje až to první",
    dvojice: "„ČESKÁ“ a „REPUBLIKA“",
  },
  {
    otazka: "Ve spojení „VYSOKÁ HORA“ (jen popis, ne název) se velké písmeno píše:",
    spravne: ZADNE,
    chybne: [
      { value: PRVNI, why: "„Vysoká“ tady jen popisuje, jaká ta hora je — nepatří do žádného jména." },
      { value: DRUHE, why: "Slovo „hora“ platí pro každou horu, a proto by velké písmeno nedávalo smysl." },
      { value: OBE, why: "Velká písmena patří jménům; tohle spojení žádné jméno není, jen popis." },
    ],
    vodítko: "jestli tímhle spojením pojmenuješ jednu určitou horu, nebo kteroukoli vysokou horu",
    proc: "tímhle spojením se dá popsat kterákoli vysoká hora, takže o jméno vůbec nejde",
    dvojice: "„VYSOKÁ“ a „HORA“",
  },
  {
    otazka: "V názvu ulice „TYRŠOVA ULICE“ se velké písmeno píše:",
    spravne: PRVNI,
    chybne: [
      { value: DRUHE, why: "Slovo „ulice“ platí pro každou ulici, a proto se píše s malým u — i když stojí až vzadu." },
      { value: OBE, why: "Obecná část názvu velké písmeno nedostane, ať už stojí vpředu, nebo vzadu." },
      { value: ZADNE, why: "Je to název jedné určité ulice, takže jedno velké písmeno tam být musí." },
    ],
    vodítko: "které z obou slov odlišuje tuhle ulici od ostatních ulic ve městě",
    proc: "odlišující část názvu je odvozená od příjmení Tyrš, kdežto „ulice“ platí pro každou ulici",
    dvojice: "„TYRŠOVA“ a „ULICE“",
  },
];

function nazevUloha(it: NazevItem): PracticeTask {
  return choice(it.otazka, it.spravne, it.chybne, {
    hints: [
      `Zeptej se, ${it.vodítko}.`,
      `Ve víceslovných názvech nedostane velké písmeno automaticky každé slovo. Obecná část (například „hory“, „ulice“ nebo „most“) platí pro celý druh a zůstává malá; velké písmeno patří té části, která pojmenovává jedno jediné místo nebo stavbu. Projdi proto obě slova zvlášť: ${it.dvojice}.`,
    ],
    explanation: `Ve víceslovném názvu se velké písmeno řídí tím, která část název odlišuje: ${it.proc}. Proto tu platí „${it.spravne}“.`,
  });
}

// ── Generátor ───────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle([...VELKE.map(velkeUloha), ...MALE.map(maleUloha)]);
  if (level === 2) return shuffle([...NAJDI_VELKE.map(najdiVelke), ...NAJDI_MALE.map(najdiMale)]);
  return shuffle([...POCTY.map(pocetUloha), ...NAZVY.map(nazevUloha)]);
}

export const VELKAPISMENA: TopicMetadata[] = [
  {
    id: "g3-cjl-velka-pismena",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-velka-pismena-ve-vlastnich-jmenech-osoby-mesta-reky-hory",
    title: "Velká písmena ve vlastních jménech (osoby, města, řeky, hory)",
    studentTitle: "Velká písmena",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se psát velká písmena u jmen lidí, měst, řek a hor.",
    keywords: ["velké písmeno", "vlastní jméno", "osoby", "města", "řeky", "hory", "Praha", "Vltava"],
    goals: ["Rozlišit vlastní a obecné jméno.", "Psát správně velké písmeno u jmen osob, měst, řek a hor.", "Opravit chybně napsaná vlastní jména."],
    boundaries: ["Jména osob, měst, řek, hor, států.", "Víceslovné zeměpisné názvy jen jako rozšíření (L3).", "Bez názvů institucí a svátků."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno = jméno KONKRÉTNÍ osoby nebo místa → velké písmeno. Obecné = každý/každá → malé.",
      steps: ["Ptám se: je to jméno konkrétní osoby nebo místa?", "Ano (Karel, Praha, Vltava, Krkonoše) → velké písmeno.", "Ne (pes, hora, řeka obecně) → malé písmeno."],
      commonMistake: "„pes“ × „Azor“ — pes je obecné (malé), Azor je jméno konkrétního psa (velké).",
      example: "Vltava (konkrétní řeka) → velké V. / řeka (obecně) → malé ř.",
    },
  },
];
