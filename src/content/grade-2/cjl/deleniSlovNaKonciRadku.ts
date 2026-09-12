import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív jedna nápověda pro celou úroveň,
// žádná zpětná vazba, jen tři možnosti a na L3 odpovědi Ano/Ne.
// Teď tři oddělené banky:
// L1 dvouslabičná slova (dá-rek): rozdělovník mezi dvěma slabikami
// L2 víceslabičná slova a slova s dvojhláskou ou/au nebo s ch (ko-hout, cha-ta)
// L3 rozhodnout, JESTLI slovo vůbec rozdělit jde: jednoslabičná slova (strom)
//    a slova, u kterých by osamělo písmeno (ucho, oběd) — proti nim slova,
//    která začínají samohláskou, a přesto se rozdělit dají (opi-ce, au-to).
// Pravidla: dělíme jen mezi slabikami; na konci ani na začátku řádku nesmí
// zůstat jedno písmeno (ch se počítá jako jedno); dvojhlásku ani ch nedělíme.

const SAMOHLASKY = "aáeéěiíoóuúůyý";
/** Počet písmen, ch = jedno písmeno. */
const pismen = (s: string) => s.replace(/ch/g, "X").length;
const slabik = (n: number) => pluralWithNumber(n, "slabiku", "slabiky", "slabik");

/** Proč je konkrétní rozdělení chybné — rozpozná typ chyby z tvaru možnosti. */
function procChybne(w: string, deleni: string, v: string): string {
  const [l, r] = v.split("-");
  if (l.endsWith("c") && r.startsWith("h")) return `Rozdělovník tu rozdělil ch. Ch je jedno písmeno (jedna hláska), a proto se nerozděluje.`;
  if (pismen(l) === 1) return `Na konci řádku by zůstalo jen jedno písmeno „${l}“ – to se nesmí.`;
  if (pismen(r) === 1) return `Na nový řádek by přešlo jen jedno písmeno „${r}“ – to se nesmí.`;
  const dvoj = /[oa]$/.test(l) && r.startsWith("u") ? `${l.slice(-1)}u` : null;
  if (dvoj) return `Rozdělovník tu rozdělil dvojhlásku ${dvoj}. Dvojhláska je jedna slabika, proto se nedělí.`;
  return `Rozdělovník tu stojí uprostřed slabiky. Slovo „${w}“ se vyslovuje po slabikách ${deleni}.`;
}

/** Všechna správná místa k dělení: hranice slabik, kde na obou stranách zůstanou aspoň dvě písmena. */
function platnaDeleni(syl: string[]): string[] {
  const out: string[] = [];
  for (let i = 1; i < syl.length; i++) {
    const l = syl.slice(0, i).join("");
    const r = syl.slice(i).join("");
    if (pismen(l) >= 2 && pismen(r) >= 2) out.push(`${l}-${r}`);
  }
  return out;
}

// ── L1: dvouslabičná slova ─────────────────────────────────────────────────
const L1: [string, string][] = [
  ["dá", "rek"], ["se", "šit"], ["do", "mek"], ["po", "koj"], ["pa", "pír"], ["ve", "čer"], ["ko", "mín"],
  ["mo", "týl"], ["be", "ran"], ["ba", "nán"], ["ka", "bát"], ["sa", "lát"], ["po", "moc"], ["ko", "pec"],
];

function dvouslabicne([s1, s2]: [string, string]): PracticeTask {
  const w = s1 + s2;
  const spravne = `${s1}-${s2}`;
  const jine = [`${w[0]}-${w.slice(1)}`, `${s1}${s2[0]}-${s2.slice(1)}`, `${w.slice(0, -1)}-${w.slice(-1)}`];
  return {
    ...choice(
      `Jak rozdělíš slovo „${w}“ na konci řádku?`,
      spravne,
      jine.map((v) => ({ value: v, why: procChybne(w, spravne, v) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Řekni „${w}“ pomalu po slabikách. Kde se hlas na chvilku zastaví?`,
          `Rozdělovník patří jen mezi slabiky. Vyslov „${w}“ po slabikách a pak zkontroluj, že na konci řádku ani na novém řádku nezůstane jen jedno písmeno.`,
        ],
        explanation: `Slovo „${w}“ má dvě slabiky – ${s1} a ${s2}. Rozdělovník proto patří mezi ně: ${spravne}. Na každém řádku zůstanou aspoň dvě písmena.`,
      },
    ),
    emoji: "↩️",
  };
}

// ── L2: víceslabičná slova, dvojhlásky, ch ─────────────────────────────────
// [slabiky, správná možnost, tři chybné]
const L2: [string[], string, [string, string, string]][] = [
  [["ko", "hout"], "ko-hout", ["koho-ut", "k-ohout", "kohou-t"]],
  [["lou", "ka"], "lou-ka", ["lo-uka", "l-ouka", "louk-a"]],
  [["hou", "ba"], "hou-ba", ["ho-uba", "h-ouba", "houb-a"]],
  [["kou", "pel"], "kou-pel", ["ko-upel", "k-oupel", "koupe-l"]],
  [["cha", "ta"], "cha-ta", ["c-hata", "ch-ata", "chat-a"]],
  [["chy", "ba"], "chy-ba", ["c-hyba", "ch-yba", "chyb-a"]],
  [["ja", "ho", "da"], "jaho-da", ["jah-oda", "j-ahoda", "jahod-a"]],
  [["lo", "pa", "ta"], "lo-pata", ["lop-ata", "l-opata", "lopat-a"]],
  [["čo", "ko", "lá", "da"], "čoko-láda", ["čok-oláda", "č-okoláda", "čokolád-a"]],
  [["pa", "pou", "šek"], "pa-poušek", ["papo-ušek", "pap-oušek", "papouše-k"]],
  [["ko", "čá", "rek"], "kočá-rek", ["koč-árek", "k-očárek", "kočáre-k"]],
  [["te", "le", "fon"], "te-lefon", ["tel-efon", "t-elefon", "telefo-n"]],
  [["po", "hád", "ka"], "po-hádka", ["poh-ádka", "p-ohádka", "pohádk-a"]],
  [["ro", "pu", "cha"], "ropu-cha", ["ropuc-ha", "rop-ucha", "r-opucha"]],
  [["ho", "di", "ny"], "hodi-ny", ["hod-iny", "h-odiny", "hodin-y"]],
];

function viceslabicne([syl, spravne, jine]: [string[], string, [string, string, string]]): PracticeTask {
  const w = syl.join("");
  const deleni = syl.join("-");
  const platna = platnaDeleni(syl);
  if (!platna.includes(spravne)) throw new Error(`L2 ${w}: ${spravne} není platné dělení`);
  for (const j of jine) if (platna.includes(j)) throw new Error(`L2 ${w}: distraktor ${j} je také správně`);
  const dvoj = syl.find((s) => /ou|au/.test(s))?.match(/ou|au/)?.[0];
  const ch = w.includes("ch");
  const pravidla = [
    "Rozdělovník patří jen mezi slabiky",
    dvoj ? `dvojhlásku ${dvoj} nikdy nerozdělujeme` : null,
    ch ? "ch se nerozděluje, protože je to jedno písmeno" : null,
  ].filter(Boolean).join(", ");
  const dalsi = platna.filter((p) => p !== spravne);
  return {
    ...choice(
      `Které rozdělení slova „${w}“ na konci řádku je správné?`,
      spravne,
      jine.map((v) => ({ value: v, why: procChybne(w, deleni, v) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Řekni „${w}“ pomalu po slabikách a najdi místa, kde se hlas zastaví.`,
          `${pravidla}. U slova „${w}“ navíc zkontroluj, že na konci řádku ani na novém řádku nezůstane samotné jedno písmeno.`,
        ],
        explanation: `Slovo „${w}“ dělíme po slabikách ${deleni}. Možnost ${spravne} dělí slovo mezi slabikami a na obou řádcích zůstanou aspoň dvě písmena` +
          `${dvoj ? `; dvojhláska ${dvoj} zůstala pohromadě` : ""}${ch ? "; ch zůstalo celé" : ""}.` +
          `${dalsi.length ? ` Stejně dobře by šlo i ${dalsi.join(" nebo ")}.` : ""}`,
      },
    ),
    emoji: "📝",
  };
}

// ── L3: jde slovo vůbec rozdělit? ──────────────────────────────────────────
const NIKAM = "nikam";

// [slabiky, chybná rozdělení] — správná odpověď se dopočítá (platné dělení, nebo „nikam“)
const L3: [string[], string[]][] = [
  [["strom"], ["st-rom", "str-om", "stro-m"]],
  [["vlak"], ["v-lak", "vl-ak", "vla-k"]],
  [["stůl"], ["s-tůl", "st-ůl", "stů-l"]],
  [["most"], ["m-ost", "mo-st", "mos-t"]],
  [["u", "cho"], ["u-cho", "uc-ho", "uch-o"]],
  [["o", "kap"], ["o-kap", "ok-ap", "oka-p"]],
  [["o", "běd"], ["o-běd", "ob-ěd", "obě-d"]],
  [["o", "řech"], ["o-řech", "oř-ech", "ořec-h"]],
  [["ú", "kol"], ["ú-kol", "úk-ol", "úko-l"]],
  [["au", "to"], ["a-uto", "aut-o"]],
  [["o", "vo", "ce"], ["o-voce", "ov-oce"]],
  [["o", "pi", "ce"], ["o-pice", "op-ice"]],
  [["u", "li", "ce"], ["u-lice", "ul-ice"]],
  [["mou", "cha"], ["mouc-ha", "mo-ucha"]],
  [["o", "ře", "chy"], ["o-řechy", "ořec-hy"]],
  [["ú", "ko", "ly"], ["ú-koly", "úk-oly"]],
];

function jdeRozdelit([syl, chybna]: [string[], string[]]): PracticeTask {
  const w = syl.join("");
  const deleni = syl.join("-");
  const platna = platnaDeleni(syl);
  if (platna.length > 1) throw new Error(`L3 ${w}: víc platných dělení`);
  const spravne = platna[0] ?? NIKAM;
  const n = syl.length;
  for (const c of chybna) if (platna.includes(c)) throw new Error(`L3 ${w}: distraktor ${c} je také správně`);
  const moznosti = platna.length ? [...chybna, NIKAM] : chybna;
  if (moznosti.length !== 3) throw new Error(`L3 ${w}: potřebuji tři chybné možnosti`);
  const why = (v: string): string => {
    if (v === NIKAM) return `Slovo „${w}“ rozdělit jde: má ${slabik(n)} a dá se rozdělit tak, aby na obou řádcích zůstala aspoň dvě písmena.`;
    if (n === 1) {
      const [l, r] = v.split("-");
      const navic = pismen(l) === 1 || pismen(r) === 1 ? " Navíc by na jednom řádku zůstalo jediné písmeno." : "";
      return `Slovo „${w}“ má jen jednu slabiku – jednoslabičné slovo se nedělí vůbec.${navic}`;
    }
    return procChybne(w, deleni, v);
  };
  const explanation =
    spravne !== NIKAM
      ? `Slovo „${w}“ má slabiky ${deleni}. Rozdělení ${spravne} vede mezi slabikami a na obou řádcích zůstanou aspoň dvě písmena${SAMOHLASKY.includes(w[0]) ? " – i když slovo začíná samohláskou" : ""}.`
      : n === 1
        ? `Slovo „${w}“ má jen jednu slabiku a jednoslabičné slovo se na konci řádku nedělí. Celé ho napíšeš na nový řádek.`
        : `Slovo „${w}“ má slabiky ${deleni}. Jediné místo mezi slabikami by nechalo samotné „${syl[0]}“ na konci řádku, a to se nesmí – proto se slovo nedělí a celé přejde na nový řádek.`;
  return {
    ...choice(
      `Slovo „${w}“ se nevejde na řádek. Kam dáš rozdělovník?`,
      spravne,
      moznosti.map((v) => ({ value: v, why: why(v) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Vyslov „${w}“ po slabikách. Zůstala by po rozdělení na některém řádku jen jedna hláska?`,
          `Slovo dělíme jen mezi slabikami. Jednoslabičné slovo se nedělí vůbec a na konci ani na začátku řádku nesmí zůstat jedno písmeno (ch se počítá jako jedno). Vyzkoušej to se slovem „${w}“ u každé nabídnuté možnosti.`,
        ],
        explanation,
      },
    ),
    emoji: "🚧",
  };
}

// Kontrola dat při načtení: L1 slabiky musí začínat souhláskou a mít jednu samohlásku.
for (const [s1, s2] of L1) {
  if ([...s1 + s2].filter((c) => SAMOHLASKY.includes(c)).length !== 2) throw new Error(`L1 ${s1}${s2}: čekám dvě slabiky`);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(dvouslabicne);
  if (level === 2) return shuffle(L2).map(viceslabicne);
  return shuffle(L3).map(jdeRozdelit);
}

export const DELENISLOVNAKONCIRADKU: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-deleni-slov-na-konci-radku",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-deleni-slov-na-konci-radku",
    title: "Dělení slov na konci řádku",
    studentTitle: "Slovo se nevejde",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, kam na konci řádku patří rozdělovník.",
    keywords: ["dělení slov", "rozdělovník", "konec řádku", "slabiky", "psaní slov"],
    goals: [
      "Vědět, že slovo se na konci řádku dělí jen mezi slabikami.",
      "Správně určit, kam patří rozdělovník.",
      "Poznat, kdy se slovo dělit nesmí (jedna slabika, nebo by osamělo písmeno).",
    ],
    boundaries: [
      "Běžná slova 2. třídy.",
      "Bez slov se shlukem souhlásek mezi samohláskami, kde je víc správných možností (ses-tra × se-stra).",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Slovo dělíme na konci řádku jen mezi slabikami. Samotné jedno písmeno nesmí zůstat na řádku.",
      steps: [
        "Rozděl slovo na slabiky.",
        "Najdi hranici mezi slabikami — tam patří rozdělovník.",
        "Zkontroluj, že na žádné straně nezůstalo jen jedno písmeno a že jsi nerozdělil(a) ou, au ani ch.",
      ],
      commonMistake: "Rozdělit slovo uprostřed slabiky, nebo nechat jedno písmeno samotné na řádku (např. 'a-no').",
      example: "dárek → dá-rek (správně). ucho → nelze rozdělit, protože by zůstalo samotné 'u'.",
    },
  },
];
