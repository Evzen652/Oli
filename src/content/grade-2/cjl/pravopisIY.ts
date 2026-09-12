import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív: L2 jen y po tvrdé, L3 jen í po
// měkké — dítě nemuselo nic rozhodovat, stačilo klikat pořád stejné písmeno;
// nápověda byla u všech úloh stejná a chyběla zpětná vazba. Teď tři oddělené banky:
// L1 poznat tvrdou / měkkou souhlásku · L2 doplnit i/í × y/ý v běžném slově
// (tvrdé i měkké souhlásky promíchané) · L3 tvary slov, kde se souhláska před
// koncovkou mění nebo ji je třeba teprve najít (pták → ptáci, kočka → kočičí).
// Možnosti jsou jen sporný grafém (y, ý, i, í), nikdy celé chybně napsané slovo.

type Grafem = "y" | "ý" | "i" | "í";
const GRAFEMY: Grafem[] = ["y", "ý", "i", "í"];
const tvrdyGrafem = (g: Grafem) => g === "y" || g === "ý";
const dlouhy = (g: Grafem) => g === "ý" || g === "í";

const TVRDE = ["h", "ch", "k", "r"];
const MEKKE = ["ž", "š", "č", "ř", "c", "j"];
const RADA_TVRDE = "h, ch, k, r (a také d, t, n)";
const RADA_MEKKE = "ž, š, č, ř, c, j (a také ď, ť, ň)";
const typSouhlasky = (c: string): "tvrdá" | "měkká" => (TVRDE.includes(c) ? "tvrdá" : "měkká");

// ── L1: poznej tvrdou / měkkou souhlásku ────────────────────────────────────
// [hledaná souhláska, tři písmena z opačné řady]
const L1: [string, [string, string, string]][] = [
  ["h", ["ž", "č", "j"]], ["h", ["š", "ř", "c"]],
  ["ch", ["š", "c", "ž"]], ["ch", ["č", "j", "ř"]],
  ["k", ["č", "ř", "ž"]], ["k", ["c", "š", "j"]],
  ["r", ["ř", "ž", "c"]], ["r", ["j", "č", "š"]],
  ["ž", ["h", "r", "k"]], ["š", ["ch", "k", "h"]], ["č", ["k", "ch", "r"]],
  ["ř", ["r", "h", "ch"]], ["c", ["k", "ch", "h"]], ["j", ["r", "k", "ch"]],
];

// Abecední pořadí, aby hledané písmeno ve výčtu nestálo pořád na stejném místě.
const ABECEDA = ["c", "č", "h", "ch", "j", "k", "r", "ř", "š", "ž"];

function poznej([c, jina]: [string, [string, string, string]]): PracticeTask {
  const typ = typSouhlasky(c);
  const vycet = [c, ...jina].sort((a, b) => ABECEDA.indexOf(a) - ABECEDA.indexOf(b)).join(", ");
  const opacna = typ === "tvrdá" ? "měkká" : "tvrdá";
  const why = (x: string): string => {
    const zaklad = `Písmeno „${x}“ je ${opacna} souhláska – patří do řady ${opacna === "měkká" ? RADA_MEKKE : RADA_TVRDE}.`;
    if (x === "ř" && c === "r") return `${zaklad} Háček z r udělá úplně jinou hlásku.`;
    if (x === "r" && c === "ř") return `${zaklad} Bez háčku je to tvrdé r, s háčkem měkké ř.`;
    return zaklad;
  };
  return {
    ...choice(
      `Které písmeno je ${typ} souhláska: ${vycet}?`,
      c,
      jina.map((x) => ({ value: x, why: why(x) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Vzpomeň si na řadu ${typ === "tvrdá" ? "tvrdých" : "měkkých"} souhlásek a porovnej s ní písmena ${vycet}.`,
          `Tvrdé souhlásky jsou ${RADA_TVRDE}, měkké jsou ${RADA_MEKKE}. Projdi písmena ${vycet} jedno po druhém a u každého se zeptej, do které řady patří.`,
        ],
        explanation: `Písmeno „${c}“ patří mezi ${typ === "tvrdá" ? "tvrdé souhlásky h, ch, k, r" : "měkké souhlásky ž, š, č, ř, c, j"}. Ostatní písmena z výčtu jsou ${typ === "tvrdá" ? "měkká" : "tvrdá"}. Po tvrdé souhlásce píšeme y/ý, po měkké i/í.`,
      },
    ),
    emoji: "🔤",
  };
}

// ── Doplňování grafému ─────────────────────────────────────────────────────
interface Dopln {
  /** Věta s jedním podtržítkem v místě sporné samohlásky. */
  veta: string;
  /** Doplněné slovo, jak se správně píše. */
  slovo: string;
  g: Grafem;
  /** Souhláska těsně před prázdným místem (malým písmem). */
  c: string;
  /** L3: základní tvar, na který se dítě může odvolat. */
  zaklad?: string;
  /** L3: souhláska v základním tvaru, když se ve tvaru změnila (pták → ptáci). */
  puvodni?: string;
  /** L3: vlastní malá nápověda, kde obecná formulace nesedí. */
  h0?: string;
}

const L2: Dopln[] = [
  { veta: "V potoce plave r_ba.", slovo: "ryba", g: "y", c: "r" },
  { veta: "Táta hraje na k_taru.", slovo: "kytaru", g: "y", c: "k" },
  { veta: "V diktátu mám jednu ch_bu.", slovo: "chybu", g: "y", c: "ch" },
  { veta: "K obědu byla r_že.", slovo: "rýže", g: "ý", c: "r" },
  { veta: "Liška je ch_trá.", slovo: "chytrá", g: "y", c: "ch" },
  { veta: "Nemůžu h_bat nohou.", slovo: "hýbat", g: "ý", c: "h" },
  { veta: "Babička začala k_chat.", slovo: "kýchat", g: "ý", c: "k" },
  { veta: "Na písku stojí k_blík.", slovo: "kyblík", g: "y", c: "k" },
  { veta: "Brankář ch_tá míč.", slovo: "chytá", g: "y", c: "ch" },
  { veta: "Mám velkou ž_zeň.", slovo: "žízeň", g: "í", c: "ž" },
  { veta: "Na keři rostou š_pky.", slovo: "šípky", g: "í", c: "š" },
  { veta: "Napiš na tabuli č_slo.", slovo: "číslo", g: "í", c: "č" },
  { veta: "Do polévky dám c_buli.", slovo: "cibuli", g: "i", c: "c" },
  { veta: "Táta umí ř_dit auto.", slovo: "řídit", g: "í", c: "ř" },
  { veta: "Řeka je velmi š_roká.", slovo: "široká", g: "i", c: "š" },
  { veta: "Po koupeli jsem č_stý.", slovo: "čistý", g: "i", c: "č" },
  { veta: "V zoo jsme viděli ž_rafu.", slovo: "žirafu", g: "i", c: "ž" },
  { veta: "Na talíři je teplé j_dlo.", slovo: "jídlo", g: "í", c: "j" },
];

const L3: Dopln[] = [
  { veta: "Na stromě zpívají ptác_.", slovo: "ptáci", g: "i", c: "c", zaklad: "pták", puvodni: "k" },
  { veta: "Ve třídě sedí kluc_.", slovo: "kluci", g: "i", c: "c", zaklad: "kluk", puvodni: "k" },
  { veta: "V potoce žijí rac_.", slovo: "raci", g: "i", c: "c", zaklad: "rak", puvodni: "k" },
  { veta: "Venku si hrají hoš_.", slovo: "hoši", g: "i", c: "š", zaklad: "hoch", puvodni: "ch" },
  { veta: "Ve škole jsou žác_.", slovo: "žáci", g: "i", c: "c", zaklad: "žák", puvodni: "k" },
  { veta: "Slyším ptač_ zpěv.", slovo: "ptačí", g: "í", c: "č", zaklad: "pták", puvodni: "k" },
  { veta: "V trávě jsou kočič_ stopy.", slovo: "kočičí", g: "í", c: "č", zaklad: "kočka", puvodni: "k" },
  { veta: "Na talíři leží rohlík_.", slovo: "rohlíky", g: "y", c: "k", zaklad: "rohlík" },
  { veta: "Na zahradě rostou hrušk_.", slovo: "hrušky", g: "y", c: "k", zaklad: "hruška" },
  { veta: "Mám ráda knih_ o zvířatech.", slovo: "knihy", g: "y", c: "h", zaklad: "kniha" },
  { veta: "Máme velk_ dům.", slovo: "velký", g: "ý", c: "k", zaklad: "velká" },
  { veta: "Ten čaj je hork_.", slovo: "horký", g: "ý", c: "k", zaklad: "horká" },
  { veta: "Babička peče sladk_ koláč.", slovo: "sladký", g: "ý", c: "k", zaklad: "sladká" },
  { veta: "Kluci hrají s míč_.", slovo: "míči", g: "i", c: "č", zaklad: "míč" },
  { veta: "Na poli pracují muž_.", slovo: "muži", g: "i", c: "ž", zaklad: "muž" },
  {
    veta: "Dáme si kuřec_ polévku.", slovo: "kuřecí", g: "í", c: "c", zaklad: "kuře",
    h0: "Jde o polévku uvařenou z kuřete. Jaké písmeno stojí ve slově „kuřec_“ těsně před prázdným místem?",
  },
];

const skupina = (g: Grafem) => (tvrdyGrafem(g) ? "y/ý" : "i/í");
const delka = (g: Grafem) => (dlouhy(g) ? "dlouhá" : "krátká");

function doplnTask(d: Dopln, level: 2 | 3): PracticeTask {
  if ((d.veta.match(/_/g) ?? []).length !== 1) throw new Error(`Věta musí mít právě jedno podtržítko: ${d.veta}`);
  const typ = typSouhlasky(d.c);
  const C = d.c.toUpperCase();
  const stem = d.veta.split(/\s+/).find((w) => w.includes("_"))!.replace(/[.,!?]/g, "");
  const zmena = d.puvodni ? ` Pozor: v základním slově „${d.zaklad}“ je ${d.puvodni}, ale ve tvaru „${d.slovo}“ už ${d.c}.` : "";
  const why = (x: Grafem): string =>
    tvrdyGrafem(x) !== tvrdyGrafem(d.g)
      ? `${C} je ${typ} souhláska, po ní se píše ${skupina(d.g)}.${zmena}`
      : `Písmeno ${tvrdyGrafem(d.g) ? "y" : "i"} sedí, ale ve slově „${d.slovo}“ je samohláska ${delka(d.g)} – vyslov ho pomalu.`;
  const distraktory = GRAFEMY.filter((x) => x !== d.g).map((x) => ({ value: x, why: why(x) })) as [Distractor, Distractor, Distractor];
  const rozhodni = `Rozhodni, jestli ${d.c} patří mezi tvrdé souhlásky h, ch, k, r, nebo měkké ž, š, č, ř, c, j. Nakonec poslouchej, jestli je samohláska krátká, nebo dlouhá.`;
  const h0 =
    level === 2
      ? `Podívej se na písmeno těsně před prázdným místem ve slově „${stem}“. Je to tvrdá, nebo měkká souhláska?`
      : d.h0 ?? `Jaké písmeno stojí těsně před prázdným místem ve slově „${stem}“? Je stejné jako v „${d.zaklad}“?`;
  const h1 =
    level === 2
      ? `Ve slově „${stem}“ stojí před prázdným místem ${d.c}. ${rozhodni}`
      : `Ve tvaru „${stem}“ stojí před prázdným místem ${d.c}${d.puvodni ? `, i když v „${d.zaklad}“ je ${d.puvodni}` : ""}. ${rozhodni}`;
  const explanation =
    `${d.puvodni ? `Ze slova „${d.zaklad}“ vznikl tvar „${d.slovo}“ a ${d.puvodni} se změnilo na ${d.c}. ` : ""}` +
    `${C} je ${typ} souhláska, po ${typ === "tvrdá" ? "tvrdé" : "měkké"} souhlásce píšeme ${skupina(d.g)}. ` +
    `Ve slově „${d.slovo}“ zní samohláska ${dlouhy(d.g) ? "dlouze" : "krátce"}, proto ${d.g}.`;
  return {
    ...choice(`Doplň i/í, nebo y/ý: „${d.veta}“`, d.g, distraktory, { hints: [h0, h1], explanation }),
    emoji: level === 2 ? "✏️" : "🧩",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(poznej);
  if (level === 2) return shuffle(L2).map((d) => doplnTask(d, 2));
  return shuffle(L3).map((d) => doplnTask(d, 3));
}

export const PRAVOPISIY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    title: "Pravopis tvrdých a měkkých souhlásek (i/y po souhláskách)",
    studentTitle: "Y nebo I?",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, kdy psát Y a kdy I.",
    keywords: ["pravopis", "tvrdé souhlásky", "měkké souhlásky", "y", "i", "ryba", "číst"],
    goals: [
      "Rozlišit tvrdé a měkké souhlásky.",
      "Vědět, že po tvrdé souhlásce píšeme Y.",
      "Vědět, že po měkké souhlásce píšeme I nebo Í.",
    ],
    boundaries: ["Pouze tvrdé a měkké souhlásky.", "Bez obojetných souhlásek."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Po h, ch, k, r píšeme y/ý. Po měkkých ž, š, č, ř, c, j píšeme i/í.",
      steps: ["Najdi souhlásku před prázdným místem.", "Je tvrdá, nebo měkká?", "Tvrdá → y/ý, měkká → i/í.", "Poslechni, jestli je samohláska krátká, nebo dlouhá."],
      commonMistake: "Záměna tvrdé a měkké souhlásky — CH je tvrdá (chyba), Č je měkká (číst). Pozor na tvary: pták, ale ptáci (c je měkká).",
      example: "Ryba: R je tvrdá → y. Číslo: Č je měkká → í.",
    },
  },
];
