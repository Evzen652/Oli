import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a nabízely stejný způsob ve dvou tvarech („rozkazovací“
// i „rozkazovacím způsobu“). Teď se určuje tvar slovesa ve větě:
// L1 základní tvary · L2 další osoby, budoucí čas, zápor · L3 zdvořilá prosba
// v podmiňovacím způsobu, věty se dvěma slovesy, neurčitek.

const ZPUSOBY: Kategorie[] = [
  { nazev: "způsob oznamovací", znak: "oznamuje, co se děje, dělo nebo bude dít (jdu, šel, půjdu)." },
  { nazev: "způsob rozkazovací", znak: "vyjadřuje rozkaz, výzvu nebo prosbu (jdi, pojďme, nechoď)." },
  { nazev: "způsob podmiňovací", znak: "vyjadřuje, co by se stalo; tvoří se se slovy by, bych, bychom (šel bych)." },
  { nazev: "neurčitek (infinitiv)", znak: "základní tvar slovesa zakončený na -t nebo -ci (jít, číst, péct)." },
];

const OZN = "způsob oznamovací", ROZ = "způsob rozkazovací", POD = "způsob podmiňovací", NEU = "neurčitek (infinitiv)";
const P = (uroven: 1 | 2 | 3, slovo: string, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "jdu", "Jdu domů.", OZN, "prostě říká, co dělám", "Jdu oznamuje děj — způsob oznamovací."),
  P(1, "jdi", "Jdi domů!", ROZ, "někoho vyzývá, aby něco udělal", "Jdi je výzva — způsob rozkazovací."),
  P(1, "šel bych", "Šel bych domů.", POD, "říká, co bych udělal, a obsahuje slovo bych", "Šel bych — co by se stalo; způsob podmiňovací."),
  P(1, "čte", "Maminka čte noviny.", OZN, "říká, co maminka dělá", "Čte oznamuje děj — způsob oznamovací."),
  P(1, "čti", "Čti nahlas!", ROZ, "vyzývá ke čtení", "Čti je výzva — způsob rozkazovací."),
  P(1, "četl bych", "Rád bych si četl.", POD, "obsahuje slovo bych a říká, co bych rád dělal", "Četl bych — přání; způsob podmiňovací."),
  P(1, "hraje", "Bratr hraje fotbal.", OZN, "říká, co bratr dělá", "Hraje oznamuje děj — způsob oznamovací."),
  P(1, "hraj", "Hraj opatrně!", ROZ, "vyzývá ke hře", "Hraj je výzva — způsob rozkazovací."),
  P(1, "hrál bys", "Hrál bys se mnou?", POD, "obsahuje slovo bys", "Hrál bys — způsob podmiňovací."),
  P(1, "píšeš", "Píšeš úkol?", OZN, "ptá se, co teď děláš", "Píšeš — i v otázce jde o způsob oznamovací."),
  P(1, "piš", "Piš úhledně!", ROZ, "vyzývá k psaní", "Piš je výzva — způsob rozkazovací."),
  P(1, "běžet", "Musím běžet.", NEU, "je základní tvar slovesa zakončený na -t", "Běžet je neurčitek — základní tvar slovesa."),
  P(1, "spal", "Dědeček spal v křesle.", OZN, "říká, co dědeček dělal", "Spal oznamuje minulý děj — způsob oznamovací."),

  P(2, "pojďme", "Pojďme ven!", ROZ, "vyzývá mě i ostatní", "Pojďme je výzva v 1. osobě množného čísla — způsob rozkazovací."),
  P(2, "přišli bychom", "Přišli bychom rádi.", POD, "obsahuje slovo bychom", "Přišli bychom — způsob podmiňovací."),
  P(2, "budu číst", "Zítra budu číst.", OZN, "oznamuje, co se stane zítra", "Budu číst — budoucí čas způsobu oznamovacího."),
  P(2, "nechoď", "Nechoď tam sám!", ROZ, "někomu něco zakazuje", "Nechoď je zákaz — rozkazovací způsob v záporu."),
  P(2, "koupili by", "Koupili by si psa.", POD, "obsahuje slovo by", "Koupili by — způsob podmiňovací."),
  P(2, "uvaříme", "Zítra uvaříme polévku.", OZN, "oznamuje, co zítra uděláme", "Uvaříme — budoucí děj; způsob oznamovací."),
  P(2, "měl bych", "Kdybys přišel, měl bych radost.", POD, "obsahuje slovo bych a říká, co by bylo", "Měl bych — způsob podmiňovací."),
  P(2, "vstávej", "Vstávej, je ráno!", ROZ, "vyzývá ke vstávání", "Vstávej je výzva — způsob rozkazovací."),
  P(2, "péct", "Umíš péct buchty?", NEU, "je základní tvar slovesa zakončený na -ct", "Péct je neurčitek."),
  P(2, "zpívejte", "Zpívejte všichni s námi!", ROZ, "vyzývá více lidí", "Zpívejte je výzva — způsob rozkazovací."),
  P(2, "šli jsme", "Včera jsme šli do kina.", OZN, "oznamuje, co se stalo včera", "Šli jsme — minulý čas způsobu oznamovacího."),
  P(2, "nezapomeň", "Nezapomeň si svačinu!", ROZ, "někoho na něco upozorňuje", "Nezapomeň je výzva — rozkazovací způsob."),
  P(2, "psal bys", "Psal bys mi dopisy?", POD, "obsahuje slovo bys", "Psal bys — způsob podmiňovací."),

  P(3, "mohl bys", "Mohl bys mi pomoct?", POD, "je to zdvořilá prosba se slovem bys", "Mohl bys — zdvořilá prosba vyjádřená podmiňovacím způsobem."),
  P(3, "pomoz", "Pomoz mi, prosím.", ROZ, "je to prosba ve tvaru výzvy", "Pomoz — i prosba může být v rozkazovacím způsobu."),
  P(3, "šli bychom", "Kdyby nepršelo, šli bychom ven.", POD, "říká, co bychom udělali, kdyby nepršelo", "Šli bychom — způsob podmiňovací."),
  P(3, "nenachlaď", "Hlavně se nenachlaď!", ROZ, "někoho před něčím varuje", "Nenachlaď se — varování v rozkazovacím způsobu."),
  P(3, "jít", "Chtěl bych jít na výlet.", NEU, "je základní tvar slovesa zakončený na -t", "Jít je neurčitek; chtěl bych je podmiňovací způsob."),
  P(3, "chtěl bych", "Chtěl bych jít na výlet.", POD, "obsahuje slovo bych", "Chtěl bych — způsob podmiňovací."),
  P(3, "nechte", "Nechte ho spát.", ROZ, "vyzývá více lidí", "Nechte je výzva — rozkazovací způsob."),
  P(3, "spát", "Nechte ho spát.", NEU, "je základní tvar slovesa", "Spát je neurčitek."),
  P(3, "zapomenout", "Nesmíš zapomenout.", NEU, "je základní tvar zakončený na -t", "Zapomenout je neurčitek; nesmíš je oznamovací."),
  P(3, "bylo by", "Bylo by hezké jet k moři.", POD, "obsahuje slovo by", "Bylo by — způsob podmiňovací."),
  P(3, "přečti", "Přečti si to ještě jednou.", ROZ, "vyzývá k přečtení", "Přečti je výzva — rozkazovací způsob."),
  P(3, "psali jsme", "Dnes jsme psali diktát.", OZN, "oznamuje, co se dnes stalo", "Psali jsme — minulý čas způsobu oznamovacího."),
  P(3, "přijedou", "Babička a dědeček přijedou v neděli.", OZN, "oznamuje, co se stane v neděli", "Přijedou — budoucí děj ve způsobu oznamovacím."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, ZPUSOBY, level, (p) => ({
    question: `Jaký tvar slovesa je „${p.slovo}“ ve větě „${p.veta}“?`,
    hints: [
      `Co vyjadřuje „${p.slovo}“ ve větě „${p.veta}“ — že se něco děje, výzvu, nebo co by se stalo?`,
      `Pomůže tohle: „${p.slovo}“ ${p.klic}.`,
    ],
  }));
}

export const SLOVESAZPUSOBOZNAMOVACIROZKAZOVACIPODMINOVACI: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci",
    title: "Slovesa – způsob oznamovací, rozkazovací, podmiňovací",
    studentTitle: "Způsoby sloves",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš tři způsoby sloves – oznamovací, rozkazovací a podmiňovací.",
    keywords: ["slovesný způsob", "oznamovací", "rozkazovací", "podmiňovací", "slovesa"],
    goals: [
      "Rozlišit oznamovací, rozkazovací a podmiňovací způsob",
      "Tvořit tvary rozkazovacího a podmiňovacího způsobu",
      "Určit způsob slovesa ve větě",
    ],
    boundaries: [
      "Neprobíráme složité historické tvary",
      "Bez přací větné stavby a složeného podmiňovacího podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Oznamovací = říkám fakta (jdu). Rozkazovací = rozkazuji (jdi!). Podmiňovací = mám podmínku nebo možnost (šel bych).",
      steps: [
        "Přečti větu a najdi sloveso.",
        "Je to fakt nebo konstatování? → oznamovací.",
        "Je to rozkaz nebo prosba? → rozkazovací.",
        "Je tam 'bych/bys/by/bychom/byste'? → podmiňovací.",
      ],
      commonMistake: "Žáci si pletou rozkazovací způsob s oznamovacím. Klíč: rozkaz má jiný tvar ('jdi' vs. 'jdeš').",
      example: "Oznamovací: Jdu domů. Rozkazovací: Jdi domů! Podmiňovací: Šel bych domů.",
    },
  },
];
