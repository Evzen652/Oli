import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Párové souhlásky (znělé × neznělé) a spodoba — RVP 2. ročník.
// Dřív téma chybělo úplně (legacy `cz-parove-souhlasky` ve 3. ročníku je vypnuté).
//
// L1 poznat párovou dvojici a znělou / neznělou souhlásku · L2 doplnit párovou
// souhlásku na KONCI slova (dub, hrad) · L3 párová souhláska UVNITŘ slova před
// jinou souhláskou (rybka, kresba), kde se ověřuje příbuzným slovem.
//
// Párová souhláska má jen dvě možná písmena. Aby úloha měla čtyři možnosti
// a nešlo tipovat 50 : 50, doplňují se v L2 a L3 vždy DVĚ mezery v jedné větě
// a možnosti jsou dvojice písmen („b, d"). Nikdy celé chybně napsané slovo.

const PARY: [string, string][] = [
  ["b", "p"], ["d", "t"], ["ď", "ť"], ["v", "f"], ["z", "s"], ["ž", "š"], ["h", "ch"], ["g", "k"],
];
const ZNELE = PARY.map(([z]) => z);
const NEZNELE = PARY.map(([, n]) => n);
const par = (x: string): string | undefined => {
  const p = PARY.find(([z, n]) => z === x || n === x);
  return p ? (p[0] === x ? p[1] : p[0]) : undefined;
};
const znela = (x: string) => ZNELE.includes(x);

// ── L1a: najdi párovou souhlásku ────────────────────────────────────────────
// [souhláska, tři blízké chyby: souhláska z jiného páru, souhláska stejné
//  znělosti, nebo souhláska bez páru, která se tvoří na podobném místě]
const L1_PAR: [string, [string, string, string]][] = [
  ["b", ["d", "f", "m"]], ["p", ["v", "t", "m"]],
  ["d", ["ť", "b", "n"]], ["t", ["ď", "p", "n"]],
  ["ď", ["t", "š", "ň"]], ["ť", ["d", "ž", "ň"]],
  ["v", ["p", "b", "m"]], ["f", ["b", "z", "m"]],
  ["z", ["š", "ž", "c"]], ["s", ["ž", "š", "c"]],
  ["ž", ["s", "z", "č"]], ["š", ["z", "s", "č"]],
  ["h", ["k", "g", "r"]], ["ch", ["g", "k", "r"]],
  ["g", ["ch", "h", "j"]], ["k", ["h", "ch", "j"]],
];

function najdiPar([x, jine]: [string, [string, string, string]]): PracticeTask {
  const klic = par(x)!;
  const zn = znela(x);
  const why = (d: string): string => {
    const p = par(d);
    if (!p) return `Souhláska „${d}“ párovou dvojici nemá – zní pořád stejně, ať stojí kdekoli ve slově.`;
    if (znela(d) === zn) return `„${d}“ je ${zn ? "znělá" : "neznělá"} stejně jako „${x}“. Pár ale tvoří znělá a neznělá souhláska – „${d}“ patří k „${p}“.`;
    return `„${d}“ je sice ${zn ? "neznělá" : "znělá"}, ale tvoří pár s „${p}“, ne s „${x}“.`;
  };
  return {
    ...choice(
      `Která souhláska tvoří pár se souhláskou „${x}“?`,
      klic,
      jine.map((d) => ({ value: d, why: why(d) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Polož si ruku na krk a vyslov „${x}“. Který zvuk se v ústech tvoří úplně stejně, jen ${zn ? "bez hlasu" : "s hlasem"}?`,
          zn
            ? `„${x}“ je znělá souhláska: při vyslovení se ti chvěje krk. Zkus „${x}“ jen zašeptat, bez hlasu. Na jakou souhlásku se změní? To je její neznělá dvojice.`
            : `„${x}“ je neznělá souhláska: krk se při ní nechvěje. Zkus ji vyslovit stejně, ale přidej k ní hlas, jako když bzučí včela. Na jakou souhlásku se změní? To je její znělá dvojice.`,
        ],
        explanation: `Souhlásky „${x}“ a „${klic}“ tvoří pár: v ústech se tvoří stejně, ${zn ? `„${x}“ zní s hlasem (znělá) a „${klic}“ bez hlasu (neznělá)` : `„${x}“ zní bez hlasu (neznělá) a „${klic}“ s hlasem (znělá)`}. Párové souhlásky jsou b–p, d–t, ď–ť, v–f, z–s, ž–š, h–ch, g–k.`,
      },
    ),
    emoji: "🗣️",
  };
}

// ── L1b: poznej znělou / neznělou souhlásku ─────────────────────────────────
// Klíč + jeho vlastní pár (nejbližší chyba) + dvě další souhlásky opačné znělosti.
const ABECEDA = ["b", "d", "ď", "f", "g", "h", "ch", "k", "p", "s", "š", "t", "ť", "v", "z", "ž"];

function poznejZnelost(klic: string, i: number): PracticeTask {
  const hledamZnelou = znela(klic);
  const opacne = hledamZnelou ? NEZNELE : ZNELE;
  const vlastniPar = par(klic)!;
  const zbytek = opacne.filter((x) => x !== vlastniPar);
  const dalsi = [zbytek[i % zbytek.length], zbytek[(i + 3) % zbytek.length]];
  const jine = [vlastniPar, ...dalsi];
  const vycet = [klic, ...jine].sort((a, b) => ABECEDA.indexOf(a) - ABECEDA.indexOf(b)).join(", ");
  const typ = hledamZnelou ? "znělá" : "neznělá";
  const why = (d: string): string =>
    `„${d}“ je ${hledamZnelou ? "neznělá – vyslovíš ji bez hlasu, krk se nechvěje" : "znělá – vyslovíš ji s hlasem, krk se chvěje"}.` +
    (d === vlastniPar ? ` S „${klic}“ tvoří pár, proto jsou si tak podobné.` : "");
  return {
    ...choice(
      `Která souhláska je ${typ}: ${vycet}?`,
      klic,
      jine.map((d) => ({ value: d, why: why(d) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Polož si ruku na krk a postupně vyslov ${vycet}. U které souhlásky ${hledamZnelou ? "ucítíš chvění" : "se krk nechvěje"}?`,
          hledamZnelou
            ? `Zkus každou ze souhlásek ${vycet} zašeptat. Znělá souhláska se šepotem změní na jinou (svou neznělou dvojici), neznělá zůstane stejná. Hledáš tu, která se změní.`
            : `Zkus každou ze souhlásek ${vycet} zašeptat. Neznělá souhláska zní šeptem úplně stejně jako nahlas, znělá se změní na svou dvojici. Hledáš tu, která se nezmění.`,
        ],
        explanation: `„${klic}“ je ${typ} souhláska${hledamZnelou ? " – zní s hlasem" : " – zní bez hlasu"}. Ostatní souhlásky z výčtu jsou ${hledamZnelou ? "neznělé" : "znělé"}. Znělé jsou b, d, ď, v, z, ž, h, g, neznělé p, t, ť, f, s, š, ch, k.`,
      },
    ),
    emoji: "🗣️",
  };
}

// ── L2, L3: doplň dvě párové souhlásky ve větě ──────────────────────────────
interface Mezera {
  /** Správné písmeno. */
  g: string;
  /** Tvar slova, ve kterém je souhláska jasně slyšet. */
  over: string;
  /** Otázka pro nápovědu: navede k ověřovacímu tvaru, ale nevysloví ho. */
  nav: string;
}
interface Veta {
  /** Věta se dvěma podtržítky. */
  veta: string;
  a: Mezera;
  b: Mezera;
}
const m = (g: string, over: string, nav: string): Mezera => ({ g, over, nav });

const L2: Veta[] = [
  { veta: "Na kopci stojí hra_ a kolem roste le_.", a: m("d", "hrady", "jeden hra_ – dva …"), b: m("s", "lesy", "jeden le_ – dva …") },
  { veta: "V zimě padá sní_ a na rybníku je le_.", a: m("h", "sněhu", "kopec plný …"), b: m("d", "ledu", "kostka …") },
  { veta: "Babička koupila chlé_ a me_.", a: m("b", "chleba", "krajíc …"), b: m("d", "medu", "sklenice …") },
  { veta: "V lese roste du_ a na něm sedí holu_.", a: m("b", "duby", "jeden du_ – dva …"), b: m("b", "holubi", "jeden holu_ – dva …") },
  { veta: "Pe_ má studený no_.", a: m("s", "psa", "hladím …"), b: m("s", "nosy", "jeden no_ – dva …") },
  { veta: "Nad polem letí dra_ i ptá_.", a: m("k", "draka", "pouštím …"), b: m("k", "ptáka", "vidím …") },
  { veta: "Na stole leží nů_ a vedle něj ko_ s jablky.", a: m("ž", "nože", "jeden nů_ – dva …"), b: m("š", "koše", "jeden ko_ – dva …") },
  { veta: "Stará ze_ má díru a v ní bydlí my_.", a: m("ď", "zdi", "obraz visí na …"), b: m("š", "myši", "jedna my_ – dvě …") },
  { veta: "Po řece pluje lo_ a vedle ní labu_.", a: m("ď", "lodě", "jedna lo_ – dvě …"), b: m("ť", "labutě", "jedna labu_ – dvě …") },
  { veta: "V lednu přišel velký mrá_ a zamrzl celý rybní_.", a: m("z", "mrazy", "jeden mrá_ – silné …"), b: m("k", "rybníky", "jeden rybní_ – dva …") },
  { veta: "Pou_ začíná v neděli a na každého čeká sladký perní_.", a: m("ť", "pouti", "na … jsem se svezl na kolotoči."), b: m("k", "perníky", "jeden perní_ – dva …") },
  { veta: "Le_ má silný hla_.", a: m("v", "lva", "v zoo vidím …"), b: m("s", "hlasy", "jeden hla_ – dva …") },
  { veta: "Na záhonu roste mrke_ a hrá_.", a: m("v", "mrkve", "kousek …"), b: m("ch", "hrachu", "hrst …") },
  { veta: "Na louce stojí dřevěný slou_ a na něm sedí su_.", a: m("p", "sloupy", "jeden slou_ – dva …"), b: m("p", "supi", "jeden su_ – dva …") },
  { veta: "Kolem zahrady je plo_ a za ním sa_.", a: m("t", "ploty", "jeden plo_ – dva …"), b: m("d", "sady", "jeden sa_ – dva …") },
  { veta: "Na dvoře stojí vů_ a na něm leží ku_ dřeva.", a: m("z", "vozy", "jeden vů_ – dva …"), b: m("s", "kusy", "jeden ku_ – dva …") },
];

const L3: Veta[] = [
  { veta: "Ve vodě plave ry_ka a na břehu sedí ža_ka.", a: m("b", "ryba", "malá ry_ka – velká …"), b: m("b", "žába", "malá ža_ka – velká …") },
  { veta: "V zahrá_ce roste mrke_.", a: m("d", "zahrada", "malá zahrá_ka – velká …"), b: m("v", "mrkve", "kousek …") },
  { veta: "Na la_ičce leží dědečkův klobou_.", a: m("v", "lavice", "malá la_ička – velká …"), b: m("k", "klobouky", "jeden klobou_ – dva …") },
  { veta: "Sestry měly há_ku o sla_ký bonbon.", a: m("d", "hádat", "co dělají lidé, když mají há_ku? (sloveso)"), b: m("d", "sladit", "čaj si cukrem … (sloveso)") },
  { veta: "Batoh je le_ký, je v něm jen chlé_.", a: m("h", "lehounký", "le_ký – úplně …ounký"), b: m("b", "chleba", "krajíc …") },
  { veta: "Ta branka je ní_ká a ú_ká.", a: m("z", "nízoučká", "ní_ká – úplně …oučká"), b: m("z", "úzoučká", "ú_ká – úplně …oučká") },
  { veta: "Dědeček nasbíral plný koší_ hří_ků.", a: m("k", "košíky", "jeden koší_ – dva …"), b: m("b", "hříbek", "jeden malý …ek") },
  { veta: "Na mé kre_bě je velký hra_.", a: m("s", "kreslit", "co dělám pastelkou? (sloveso)"), b: m("d", "hrady", "jeden hra_ – dva …") },
  { veta: "Mám k tobě pro_bu: podej mi nů_.", a: m("s", "prosit", "když mám pro_bu, chci o něco … (sloveso)"), b: m("ž", "nože", "jeden nů_ – dva …") },
  { veta: "Ptá_ vypil ka_ku rosy.", a: m("k", "ptáka", "vidím …"), b: m("p", "kapat", "co dělá voda z kohoutku? (sloveso)") },
  { veta: "Na umyvadle leží kartáče_ na zou_ky.", a: m("k", "kartáčky", "jeden kartáče_ – dva …"), b: m("b", "zoubek", "jeden malý …ek") },
  { veta: "Za lesem stojí malá chalou_ka a u ní du_.", a: m("p", "chalupa", "malá chalou_ka – velká …"), b: m("b", "duby", "jeden du_ – dva …") },
  { veta: "Koťátko má ostré drá_ky a he_ký kožíšek.", a: m("p", "drápy", "tygr má velké …"), b: m("b", "hebounký", "he_ký – úplně …ounký") },
];

/** Slova s mezerou, jak stojí ve větě („hra_"). */
function slovaSMezerou(veta: string): [string, string] {
  const slova = veta.split(/\s+/).filter((w) => w.includes("_")).map((w) => w.replace(/[.,!?:]/g, ""));
  if (slova.length !== 2) throw new Error(`Věta musí mít právě dvě mezery ve dvou slovech: ${veta}`);
  return [slova[0], slova[1]];
}

function doplnTask(v: Veta, level: 2 | 3): PracticeTask {
  const [s1, s2] = slovaSMezerou(v.veta);
  // Malým písmenem: ve vysvětlení stojí slovo uprostřed věty („Píšeme pes…").
  const cele1 = s1.replace("_", v.a.g).toLowerCase();
  const cele2 = s2.replace("_", v.b.g).toLowerCase();
  const p1 = par(v.a.g)!;
  const p2 = par(v.b.g)!;
  const klic = `${v.a.g}, ${v.b.g}`;
  const vysvetli = (s: string, mez: Mezera) => `„${s}“ – v „${mez.over}“ je jasně slyšet ${mez.g}`;
  const kombinace: [string, string][] = [[p1, v.b.g], [v.a.g, p2], [p1, p2]];
  const distraktory = kombinace.map(([x, y]) => {
    const chyby: string[] = [];
    if (x !== v.a.g) chyby.push(vysvetli(cele1, v.a));
    if (y !== v.b.g) chyby.push(vysvetli(cele2, v.b));
    const uvod = chyby.length === 2 ? "Obě písmena nesedí" : x !== v.a.g ? "První písmeno nesedí" : "Druhé písmeno nesedí";
    return { value: `${x}, ${y}`, why: `${uvod}: ${chyby.join("; ")}.` };
  }) as [Distractor, Distractor, Distractor];

  const naKonci = [s1, s2].some((s) => s.endsWith("_"));
  const uvnitr = [s1, s2].some((s) => !s.endsWith("_"));
  const kde = uvnitr ? (naKonci ? "Uprostřed slova před jinou souhláskou i na konci slova" : "Uprostřed slova před jinou souhláskou") : "Na konci slova";
  const tecka = (s: string) => (/[….?]$/.test(s) ? s : `${s}.`);
  const h0 = `Ve slovech „${s1}“ a „${s2}“ chybí párová souhláska. ${kde} ji slyšíme jinak, než ji píšeme.`;
  const h1 =
    `Řekni si každé slovo v jiném tvaru. Slovo „${s1}“: ${tecka(v.a.nav)} Slovo „${s2}“: ${tecka(v.b.nav)} ` +
    `V novém tvaru stojí za souhláskou samohláska, a tak ji jasně uslyšíš. Stejné písmeno pak napiš i do původního slova.`;
  const proc = [
    naKonci && "Na konci slova zní párová souhláska vždycky nezněle",
    uvnitr && (naKonci ? "uprostřed slova se přizpůsobí souhlásce, která stojí za ní" : "uprostřed slova se párová souhláska přizpůsobí souhlásce, která stojí za ní"),
  ].filter(Boolean).join(" a ");
  const explanation =
    `Píšeme ${cele1} a ${cele2}. Ověříme to tvarem, kde za souhláskou stojí samohláska: ` +
    `„${v.a.over}“ (slyšíme ${v.a.g}) a „${v.b.over}“ (slyšíme ${v.b.g}). ` +
    `${proc.charAt(0).toUpperCase()}${proc.slice(1)}, proto ji musíme ověřit.`;
  return {
    ...choice(`Doplň písmena do obou mezer (v pořadí zleva): „${v.veta}“`, klic, distraktory, { hints: [h0, h1], explanation }),
    emoji: level === 2 ? "✏️" : "🧩",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    const par_ = L1_PAR.map(najdiPar);
    const znelost = [...ZNELE, ...NEZNELE].map((k, i) => poznejZnelost(k, i));
    return shuffle([...par_, ...znelost]);
  }
  if (level === 2) return shuffle(L2).map((v) => doplnTask(v, 2));
  return shuffle(L3).map((v) => doplnTask(v, 3));
}

export const PAROVE_SOUHLASKY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-souhlasky-znele-a-neznele-parove-spodoba",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-souhlasky-znele-a-neznele-parove-spodoba",
    title: "Souhlásky znělé a neznělé (párové), spodoba",
    studentTitle: "B, nebo P?",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se ověřit, jestli na konci slova psát b, nebo p.",
    keywords: ["párové souhlásky", "znělé", "neznělé", "spodoba", "dub", "hrad", "ověřování"],
    goals: [
      "Poznat párové souhlásky b–p, d–t, ď–ť, v–f, z–s, ž–š, h–ch, g–k.",
      "Rozlišit znělou a neznělou souhlásku.",
      "Ověřit párovou souhlásku na konci a uprostřed slova jiným tvarem nebo příbuzným slovem.",
    ],
    boundaries: ["Jen párové souhlásky.", "Bez předpon (od-, pod-, nad-) a bez cizích slov."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na konci slova a před jinou souhláskou slyšíme párovou souhlásku jinak, než ji píšeme. Řekni si jiný tvar slova, kde za ní stojí samohláska.",
      steps: [
        "Najdi místo, kde chybí párová souhláska.",
        "Řekni si slovo v jiném tvaru nebo příbuzné slovo, ve kterém za souhláskou stojí samohláska (dub → duby, rybka → ryba).",
        "Poslechni si, jestli slyšíš b, nebo p (d, nebo t…).",
        "Stejné písmeno napiš i do původního slova.",
      ],
      commonMistake: "Psát podle toho, co slyšíme: „dup“ místo „dub“, „rypka“ místo „rybka“. Na konci slova zní b jako p, uvnitř slova se souhláska přizpůsobí té další.",
      example: "Hra_ → hrady → slyším d → hrad. Kre_ba → kreslit → slyším s → kresba.",
    },
  },
];
