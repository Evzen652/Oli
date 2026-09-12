import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív: možnosti byla celá chybně
// napsaná slova („deti“, „mesto“), nápověda L1 prozrazovala odpověď (hint_leak),
// všechny doplňovačky měly klíč „s háčkem“ a chyběla zpětná vazba.
// Teď tři oddělené banky:
// L1 poznat slovo se skupinou dě/tě/ně/bě/pě/vě/mě mezi správně napsanými slovy
// L2 doplnit skupinu v běžném slově — promíchaná slova s ě i s obyčejným e,
//    takže dítě musí poslouchat, ne jen klikat na háček
// L3 skupina v jiném tvaru slova (na stromě, ve vodě), dvě skupiny v jednom
//    slově (dědeček) a dlouhé é (déšť)
// Doplňuje se jen sporná skupina písmen, nikdy celé chybně napsané slovo.
// Chybné možnosti jsou typické chyby: e bez háčku, é místo ě (čárka × háček)
// a zápis podle sluchu (ďe, bje, mňe).

type Souhlaska = "d" | "t" | "n" | "b" | "p" | "v" | "m";
type Samohlaska = "ě" | "e" | "é";

/** Jak skupinu s ě slyšíme — a jak ji děti často chybně píšou podle sluchu. */
const SLYSIME: Record<Souhlaska, string> = { d: "ďe", t: "ťe", n: "ňe", b: "bje", p: "pje", v: "vje", m: "mňe" };
const DTN = (c: Souhlaska) => c === "d" || c === "t" || c === "n";
const PROC_HACEK: Record<Souhlaska, string> = {
  d: "měkké ď se tu nepíše háčkem nad d, ale háčkem nad e",
  t: "měkké ť se tu nepíše háčkem nad t, ale háčkem nad e",
  n: "měkké ň se tu nepíše háčkem nad n, ale háčkem nad e",
  b: "j, které slyšíme, se nepíše – místo něj dáváme háček nad e",
  p: "j, které slyšíme, se nepíše – místo něj dáváme háček nad e",
  v: "j, které slyšíme, se nepíše – místo něj dáváme háček nad e",
  m: "ň, které slyšíme, se nepíše – místo něj dáváme háček nad e",
};

// ── L1: najdi slovo se skupinou ─────────────────────────────────────────────
// [souhláska, slovo se skupinou, tři správně napsaná slova bez ní]
const L1: [Souhlaska, string, [string, string, string]][] = [
  ["d", "děti", ["deska", "dům", "díra"]],
  ["d", "dělat", ["deset", "doma", "dílo"]],
  ["t", "tělo", ["teta", "tuba", "tráva"]],
  ["t", "těšit", ["tenis", "taška", "tygr"]],
  ["n", "něco", ["nebe", "noha", "nit"]],
  ["n", "někdo", ["nese", "nůž", "nora"]],
  ["b", "běhat", ["beran", "bota", "bílý"]],
  ["b", "oběd", ["obec", "obal", "obilí"]],
  ["p", "pět", ["pes", "pivo", "pole"]],
  ["p", "pěna", ["pero", "pata", "pila"]],
  ["v", "věc", ["vesta", "voda", "vítr"]],
  ["v", "věta", ["veverka", "vana", "víla"]],
  ["m", "město", ["metro", "most", "míč"]],
  ["m", "měsíc", ["med", "mák", "mísa"]],
];

const SAMOHLASKY = "aáeéěiíoóuúůyý";

function najdi([c, slovo, jina]: [Souhlaska, string, [string, string, string]], i: number): PracticeTask {
  const sk = `${c}ě`;
  const why = (w: string): string => {
    const za = w[w.indexOf(c) + 1];
    if (za === "e") return `V „${w}“ je po ${c} obyčejné e bez háčku – čte se tvrdě [${c}e], ne [${SLYSIME[c]}].`;
    return SAMOHLASKY.includes(za)
      ? `V „${w}“ je po ${c} samohláska ${za}, skupina ${sk} tam vůbec není.`
      : `V „${w}“ je po ${c} souhláska ${za}, skupina ${sk} tam vůbec není.`;
  };
  const past = jina.find((w) => w.includes(`${c}e`)) ?? jina[0];
  return {
    ...choice(
      i % 2 === 0 ? `Ve kterém slově je skupina „${sk}“?` : `Které slovo obsahuje skupinu „${sk}“?`,
      slovo,
      jina.map((w) => ({ value: w, why: why(w) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Pozor na podobná slova, jako je „${past}“. Hledáš ${c} a hned za ním e s háčkem.`,
          `Skupina „${sk}“ se píše ${c} a ě a čte se [${SLYSIME[c]}]. Projdi slova z nabídky jedno po druhém a dívej se na písmeno hned za ${c}. Ve slově „${past}“ je za ${c} jen e bez háčku.`,
        ],
        explanation: `Ve slově „${slovo}“ se píše ${c} a za ním ě – čteme ho [${SLYSIME[c]}]. V ostatních slovech je po ${c} buď obyčejné e, nebo jiná hláska.`,
      },
    ),
    emoji: "🔍",
  };
}

// ── L2 a L3: doplň skupinu ─────────────────────────────────────────────────
interface Dopln {
  /** Věta s jedním podtržítkem místo celé skupiny (souhláska + samohláska). */
  veta: string;
  /** Doplněné slovo, jak se správně píše. */
  slovo: string;
  c: Souhlaska;
  g: Samohlaska;
  /** Co slovo znamená — napoví, které slovo do věty patří, a neprozradí zápis. */
  vyznam: string;
  /** L3: základní tvar slova, když se skupina objeví až v jiném tvaru (strom → na stromě). */
  zaklad?: string;
}

const L2: Dopln[] = [
  { veta: "Na hřišti si hrají _ti.", slovo: "děti", c: "d", g: "ě", vyznam: "malí kluci a holky" },
  { veta: "Po koupeli si utřu celé _lo.", slovo: "tělo", c: "t", g: "ě", vyznam: "ruce, nohy, hlava i bříško dohromady" },
  { veta: "Chci ti _co ukázat.", slovo: "něco", c: "n", g: "ě", vyznam: "nějaká věc, kterou zatím neznáš" },
  { veta: "Rád _hám po louce.", slovo: "běhám", c: "b", g: "ě", vyznam: "pohybovat se rychle po svých, jako při závodu" },
  { veta: "Na ruce mám _t prstů.", slovo: "pět", c: "p", g: "ě", vyznam: "číslo mezi čtyřmi a šesti" },
  { veta: "Ta _c je moje.", slovo: "věc", c: "v", g: "ě", vyznam: "nějaký předmět" },
  { veta: "Praha je velké _sto.", slovo: "město", c: "m", g: "ě", vyznam: "místo s mnoha domy a ulicemi" },
  { veta: "Musím _lat úkoly.", slovo: "dělat", c: "d", g: "ě", vyznam: "pracovat na něčem" },
  { veta: "V noci svítí _síc.", slovo: "měsíc", c: "m", g: "ě", vyznam: "světlo na noční obloze, které mění tvar" },
  { veta: "Ten kufr je moc _žký.", slovo: "těžký", c: "t", g: "ě", vyznam: "má velkou váhu, špatně se nese" },
  { veta: "Za dveřmi stojí _kdo.", slovo: "někdo", c: "n", g: "ě", vyznam: "nějaký člověk, ale nevíme který" },
  { veta: "Máš moc _kný obrázek.", slovo: "pěkný", c: "p", g: "ě", vyznam: "hezký" },
  { veta: "Napiš celou _tu.", slovo: "větu", c: "v", g: "ě", vyznam: "slova, která spolu dávají smysl a končí tečkou" },
  { veta: "Na stole je _set jablek.", slovo: "deset", c: "d", g: "e", vyznam: "číslo, které následuje po devítce" },
  { veta: "Přijela k nám _ta Jana.", slovo: "teta", c: "t", g: "e", vyznam: "maminčina nebo tatínkova sestra" },
  { veta: "Pes _se kost.", slovo: "nese", c: "n", g: "e", vyznam: "drží něco a jde s tím" },
  { veta: "Na louce se pase _ran.", slovo: "beran", c: "b", g: "e", vyznam: "samec ovce" },
  { veta: "Píšu novým _rem.", slovo: "perem", c: "p", g: "e", vyznam: "psací potřeba s inkoustem" },
  { veta: "Oblékl si teplou _stu.", slovo: "vestu", c: "v", g: "e", vyznam: "oblečení bez rukávů" },
  { veta: "Do čaje si dám _d.", slovo: "med", c: "m", g: "e", vyznam: "sladká pochoutka od včel" },
];

const L3: Dopln[] = [
  { veta: "Veverka sedí na stro_.", slovo: "stromě", c: "m", g: "ě", vyznam: "kde veverka sedí", zaklad: "strom" },
  { veta: "Ryba plave ve vo_.", slovo: "vodě", c: "d", g: "ě", vyznam: "kde ryba plave", zaklad: "voda" },
  { veta: "Zajíc sedí v trá_.", slovo: "trávě", c: "v", g: "ě", vyznam: "kde zajíc sedí", zaklad: "tráva" },
  { veta: "Kočka spí na plo_.", slovo: "plotě", c: "t", g: "ě", vyznam: "kde kočka spí", zaklad: "plot" },
  { veta: "Na chod_ je tma.", slovo: "chodbě", c: "b", g: "ě", vyznam: "kde je tma", zaklad: "chodba" },
  { veta: "Na zahra_ kvetou růže.", slovo: "zahradě", c: "d", g: "ě", vyznam: "kde kvetou růže", zaklad: "zahrada" },
  { veta: "Klobouk mám na hla_.", slovo: "hlavě", c: "v", g: "ě", vyznam: "kde nosím klobouk", zaklad: "hlava" },
  { veta: "Na lí_ zpívá kos.", slovo: "lípě", c: "p", g: "ě", vyznam: "kde zpívá kos", zaklad: "lípa" },
  { veta: "Obraz visí na stě_.", slovo: "stěně", c: "n", g: "ě", vyznam: "kde visí obraz", zaklad: "stěna" },
  { veta: "Na ná_stí stojí kašna.", slovo: "náměstí", c: "m", g: "ě", vyznam: "velké volné prostranství uprostřed obce" },
  { veta: "Děti běhají na hřiš_.", slovo: "hřiště", c: "t", g: "ě", vyznam: "místo, kde se hraje fotbal a běhá" },
  { veta: "K o_du bude polévka.", slovo: "obědu", c: "b", g: "ě", vyznam: "teplé jídlo v poledne" },
  { veta: "Náš _deček má vousy.", slovo: "dědeček", c: "d", g: "ě", vyznam: "tatínek maminky nebo tatínka" },
  { veta: "Můj dě_ček čte noviny.", slovo: "dědeček", c: "d", g: "e", vyznam: "starý pán, kterému říkáš děda" },
  { veta: "Venku padá _šť.", slovo: "déšť", c: "d", g: "é", vyznam: "voda, která padá z mraků" },
  { veta: "Kočka leží na _ce.", slovo: "dece", c: "d", g: "e", vyznam: "měkká přikrývka na gauči" },
];

function doplnTask(d: Dopln, level: 2 | 3): PracticeTask {
  if ((d.veta.match(/_/g) ?? []).length !== 1) throw new Error(`Věta musí mít právě jedno podtržítko: ${d.veta}`);
  const { c, g, slovo } = d;
  const S = SLYSIME[c];
  const spravne = `${c}${g}`;
  const stem = d.veta.split(/\s+/).find((w) => w.includes("_"))!.replace(/[.,!?]/g, "");
  const moznosti = [`${c}ě`, `${c}e`, `${c}é`, S];
  const why = (x: string): string => {
    if (x === `${c}ě`) {
      return g === "e"
        ? `Háček by ${c} změkčil na [${S}]. Ve slově „${slovo}“ ale v tomhle místě zní tvrdé [${c}e].`
        : `Ve slově „${slovo}“ neslyšíš měkké [${S}], ale dlouhé [${c}é] – dlouhé e má čárku, ne háček.`;
    }
    if (x === `${c}e`) {
      return g === "ě"
        ? `Bez háčku by se četlo tvrdě [${c}e]. Ve slově „${slovo}“ ale slyšíš měkké [${S}].`
        : `Ve slově „${slovo}“ je e dlouhé, a dlouhé e potřebuje čárku.`;
    }
    if (x === `${c}é`) {
      return g === "ě"
        ? `Písmeno é je dlouhé e s čárkou. Ve slově „${slovo}“ zní e krátce a měkce – měkkost se značí háčkem, ne čárkou.`
        : `Písmeno é je dlouhé e s čárkou. Ve slově „${slovo}“ se e v tomhle místě vyslovuje krátce.`;
    }
    // zápis podle sluchu
    return g === "ě"
      ? `Takhle to opravdu slyšíme: [${S}]. Píše se to ale jinak – ${PROC_HACEK[c]}.`
      : `Skupina „${S}“ by zněla měkce. Ve slově „${slovo}“ je ${c} v tomhle místě tvrdé${g === "é" ? " a e dlouhé" : ""}.`;
  };
  const distraktory = moznosti.filter((x) => x !== spravne).map((x) => ({ value: x, why: why(x) })) as [Distractor, Distractor, Distractor];
  const h0 = d.zaklad
    ? `Základ slova je „${d.zaklad}“. Řekni celou větu nahlas a poslouchej, jak zní konec slova „${stem}“.`
    : level === 2
      ? `Které slovo se hodí do věty? Co znamená: ${d.vyznam}. Řekni ho nahlas.`
      : `Co slovo znamená: ${d.vyznam}. Řekni celou větu nahlas a poslouchej hlásku po ${c} ve slově „${stem}“.`;
  const h1 =
    `Ve slově „${stem}“ chybí skupina písmen. Poslouchej hlásku po ${c}: zní měkce jako [${S}], tvrdě jako [${c}e], nebo dlouze jako [${c}é]? ` +
    `Měkké [${S}] píšeme ${c} a e s háčkem, tvrdé ${c} a obyčejné e, dlouhé ${c} a e s čárkou.`;
  const uvod = d.zaklad ? `Slovo „${d.zaklad}“ má ve větě tvar „${slovo}“. ` : "";
  const explanation =
    g === "ě"
      ? `${uvod}Ve slově „${slovo}“ slyšíš [${S}], ale píšeš ${c}ě: ${PROC_HACEK[c]}.`
      : g === "e"
        ? `${uvod}Ve slově „${slovo}“ zní v doplňovaném místě tvrdé [${c}e], proto obyčejné e bez háčku.${slovo === "dědeček" ? " První skupina dě je měkká, druhá de tvrdá." : ""}`
        : `${uvod}Ve slově „${slovo}“ zní dlouhé [${c}é] – dlouhé e se píše s čárkou, ne s háčkem.`;
  return {
    ...choice(`Doplň skupinu písmen: „${d.veta}“`, spravne, distraktory, { hints: [h0, h1], explanation }),
    emoji: level === 2 ? "✏️" : "🧩",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1.map((x, i) => najdi(x, i)));
  if (level === 2) return shuffle(L2).map((d) => doplnTask(d, 2));
  return shuffle(L3).map((d) => doplnTask(d, 3));
}

export const SKUPINYDЕТЕНЕ: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me",
    title: "Skupiny dě-tě-ně-bě-pě-vě-mě",
    studentTitle: "Dě, tě, ně, bě, pě, vě, mě",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se psát skupiny dě, tě, ně, bě, pě, vě, mě.",
    keywords: ["skupiny", "dě", "tě", "ně", "bě", "pě", "vě", "mě", "háček", "ě"],
    goals: [
      "Rozpoznat a správně napsat skupiny dě, tě, ně, bě, pě, vě, mě.",
      "Vědět, že za písmeny d, t, n, b, p, v, m se píše ě (ne e ani i).",
    ],
    boundaries: ["Pouze základní slova z 2. třídy.", "Bez výjimek a složených slov."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slyšíš-li [ďe, ťe, ňe, bje, pje, vje, mňe], píšeš dě, tě, ně, bě, pě, vě, mě.",
      steps: ["Přečti větu a řekni doplňované slovo nahlas.", "Poslouchej hlásku po souhlásce: zní měkce, nebo tvrdě?", "Měkce → e s háčkem, tvrdě → obyčejné e."],
      commonMistake: "Psát podle sluchu — „ďeti“, „bježet“, „mňesto“ místo děti, běžet, město. Nebo zaměnit háček za čárku (é).",
      example: "Děti, tělo, něco, běhat, pět, věc, město — ale deset, teta, beran (tvrdě, bez háčku).",
    },
  },
];
