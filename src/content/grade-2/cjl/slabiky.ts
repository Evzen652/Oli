import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pad, pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív osm úloh na úroveň, jedna
// nápověda („tleskni“) pro všechny, žádná zpětná vazba a pravidlo „kolik
// samohlásek, tolik slabik“ platilo i u slov s ou/au, kde neplatí.
// Teď tři oddělené banky:
// L1 spočítat slabiky ve slově s obyčejnými samohláskami
// L2 rozdělit víceslabičné slovo na slabiky (vybrat správné rozdělení)
// L3 transfer: dvojhlásky ou/au (jedna slabika), slabikotvorné r a l
//    (vlk, krk) a obrácená úloha — najdi slovo s daným počtem slabik.
// Nápovědy záměrně neobsahují číslice: klíč je počet slabik.

const SAMOHLASKY = "aáeéěiíoóuúůyý";
const samohlasky = (w: string) => [...w].filter((ch) => SAMOHLASKY.includes(ch));
const slabik = (n: number) => pluralWithNumber(n, "slabika", "slabiky", "slabik");
const slabikAk = (n: number) => pluralWithNumber(n, "slabiku", "slabiky", "slabik");

// ── L1: spočítej slabiky ────────────────────────────────────────────────────
// Jen slova s obyčejnými samohláskami — počet samohlásek = počet slabik.
const L1: [string, string][] = [
  ["pes", "pes"], ["dům", "dům"], ["míč", "míč"], ["strom", "strom"],
  ["máma", "má-ma"], ["kolo", "ko-lo"], ["ryba", "ry-ba"], ["škola", "ško-la"],
  ["kočička", "ko-čič-ka"], ["telefon", "te-le-fon"], ["kalhoty", "kal-ho-ty"], ["okurka", "o-kur-ka"],
  ["čokoláda", "čo-ko-lá-da"], ["pomeranče", "po-me-ran-če"],
];

function pocetMoznosti(n: number): number[] {
  return n <= 3 ? [1, 2, 3, 4] : [n - 2, n - 1, n, n + 1];
}

function spocitej([w, deleni]: [string, string]): PracticeTask {
  const n = deleni.split("-").length;
  const sam = samohlasky(w);
  if (sam.length !== n) throw new Error(`L1 slovo ${w}: počet samohlásek ≠ počet slabik`);
  const pismena = [...w].join(" · ");
  const samText = n === 1 ? `jen jedna samohláska ${sam[0]}` : `samohlásky ${sam.join(", ")}`;
  const why = (k: number): string => {
    if (k === n - 1) return `O slabiku méně – dvě slabiky ti splynuly v jednu. Ve slově „${w}“ jsou samohlásky ${sam.join(", ")} a každá patří do jiné slabiky.`;
    if (k < n) return `Slabik je víc. Ve slově „${w}“ najdeš samohlásky ${sam.join(", ")} – každá je srdcem jedné slabiky.`;
    if (k === w.length) return `Tolik má slovo „${w}“ písmen, ne slabik. Slabiky se počítají podle samohlásek a ve slově je ${samText}.`;
    if (k === n + 1) return `O slabiku víc. Nepočítej souhlásky – ve slově „${w}“ je ${samText}.`;
    return `O hodně víc, než kolik slabik slovo „${w}“ má. Tleskni ho pomalu a počítej jen samohlásky – ve slově je ${samText}.`;
  };
  const moznosti = pocetMoznosti(n);
  return {
    ...choice(
      `Kolik slabik má slovo „${w}“?`,
      String(n),
      moznosti.filter((k) => k !== n).map((k) => ({ value: String(k), why: why(k) })) as [Distractor, Distractor, Distractor],
      {
        hints: [
          `Řekni slovo „${w}“ nahlas a u každé slabiky jednou tleskni.`,
          `Projdi písmena ${pismena} a zastav se u každé samohlásky (a, e, i, o, u, y a jejich dlouhé tvary). Každá samohláska patří do jiné slabiky, takže kolik jich najdeš, tolik slabik slovo „${w}“ má.`,
        ],
        explanation: n === 1
          ? `Ve slově „${w}“ je jediná samohláska ${sam[0]}, a ta tvoří jedinou slabiku. Slovo „${w}“ má proto ${slabikAk(1)} a na slabiky se nedělí.`
          : `Slovo „${w}“ dělíme na slabiky ${deleni}. Každou slabiku tvoří jedna samohláska (${sam.join(", ")}), proto má slovo ${slabikAk(n)}.`,
      },
    ),
    emoji: "👏",
  };
}

// ── L2: rozděl na slabiky ──────────────────────────────────────────────────
// Jen slova, kde mezi samohláskami stojí vždy jedna souhláska — rozdělení je
// jednoznačné (každá slabika začíná souhláskou).
const L2: string[][] = [
  ["ja", "ho", "da"], ["ka", "ma", "rád"], ["po", "čí", "tač"], ["lo", "pa", "ta"],
  ["če", "pi", "ce"], ["ko", "by", "la"], ["se", "ke", "ra"], ["mo", "tý", "lek"],
  ["ro", "di", "na"], ["li", "mo", "ná", "da"], ["te", "le", "vi", "ze"], ["ze", "le", "ni", "na"],
  ["ka", "lu", "že"], ["pa", "pí", "rek"],
];

function rozdel(syl: string[]): PracticeTask {
  const w = syl.join("");
  const n = syl.length;
  const spravne = syl.join("-");
  // chyba 1: souhláska mezi samohláskami přilepená k předchozí slabice
  const posun = syl.map((s, i) => {
    const bez = i > 0 ? s.slice(1) : s;
    const dalsi = syl[i + 1];
    return dalsi ? bez + dalsi[0] : bez;
  }).join("-");
  // chyba 2 a 3: dvě slabiky slité v jednu (na konci / na začátku)
  const konec = [...syl.slice(0, n - 2), syl[n - 2] + syl[n - 1]].join("-");
  const zacatek = [syl[0] + syl[1], ...syl.slice(2)].join("-");
  const sam = samohlasky(w);
  const slite = (a: string, b: string) =>
    `Tady jsou jen ${pad(n - 1, "ČÁST")}, ale v „${a}${b}“ jsou dvě samohlásky (${samohlasky(a)[0]}, ${samohlasky(b)[0]}) – to jsou dvě slabiky.`;
  const distraktory: [Distractor, Distractor, Distractor] = [
    { value: posun, why: `Souhlásky jsou tu přilepené k předchozí slabice. Když „${w}“ vyslovíš pomalu, každá souhláska mezi samohláskami začíná novou slabiku.` },
    { value: konec, why: slite(syl[n - 2], syl[n - 1]) },
    { value: zacatek, why: slite(syl[0], syl[1]) },
  ];
  const posledniZavrena = !SAMOHLASKY.includes(w[w.length - 1]);
  return {
    ...choice(`Jak se dělí na slabiky slovo „${w}“?`, spravne, distraktory, {
      hints: [
        `Řekni „${w}“ pomalu a u každé slabiky tleskni. Kolik částí slyšíš?`,
        `Ve slově „${w}“ jsou samohlásky ${sam.join(", ")} a každá patří do jiné slabiky. Souhláska mezi dvěma samohláskami jde vždy k té další. Vyber rozdělení, kde to platí pro všechny části.`,
      ],
      explanation: `Slovo „${w}“ má samohlásky ${sam.join(", ")}, tedy ${slabik(n)}: ${spravne}. Každá slabika začíná souhláskou a končí samohláskou${posledniZavrena ? ", jen poslední si nechá i koncovou souhlásku" : ""}.`,
    }),
    emoji: "✂️",
  };
}

// ── L3: dvojhlásky, slabikotvorné r/l, obrácená úloha ──────────────────────
interface Pocet {
  w: string;
  deleni: string;
  /** Čím jsou slabiky tvořené (samohláska, dvojhláska, r/l). */
  jadra: string[];
  typ: "dvojhlaska" | "rl";
  moznosti: number[];
}

const L3_POCET: Pocet[] = [
  { w: "autobus", deleni: "au-to-bus", jadra: ["au", "o", "u"], typ: "dvojhlaska", moznosti: [2, 3, 4, 5] },
  { w: "pavouk", deleni: "pa-vouk", jadra: ["a", "ou"], typ: "dvojhlaska", moznosti: [1, 2, 3, 4] },
  { w: "housenka", deleni: "hou-sen-ka", jadra: ["ou", "e", "a"], typ: "dvojhlaska", moznosti: [2, 3, 4, 5] },
  { w: "koupat", deleni: "kou-pat", jadra: ["ou", "a"], typ: "dvojhlaska", moznosti: [1, 2, 3, 4] },
  { w: "autíčko", deleni: "au-tíč-ko", jadra: ["au", "í", "o"], typ: "dvojhlaska", moznosti: [2, 3, 4, 5] },
  { w: "vlk", deleni: "vlk", jadra: ["l"], typ: "rl", moznosti: [0, 1, 2, 3] },
  { w: "krk", deleni: "krk", jadra: ["r"], typ: "rl", moznosti: [0, 1, 2, 3] },
  { w: "vlna", deleni: "vl-na", jadra: ["l", "a"], typ: "rl", moznosti: [1, 2, 3, 4] },
  { w: "prsty", deleni: "prs-ty", jadra: ["r", "y"], typ: "rl", moznosti: [1, 2, 3, 4] },
  { w: "zmrzlina", deleni: "zmrz-li-na", jadra: ["r", "i", "a"], typ: "rl", moznosti: [1, 2, 3, 4] },
  { w: "čtvrtek", deleni: "čtvr-tek", jadra: ["r", "e"], typ: "rl", moznosti: [1, 2, 3, 4] },
];

function pocetL3(p: Pocet): PracticeTask {
  const n = p.deleni.split("-").length;
  if (p.jadra.length !== n) throw new Error(`L3 ${p.w}: jádra ≠ slabiky`);
  const dvoj = p.jadra.find((j) => j.length === 2);
  const rl = p.jadra.find((j) => j === "r" || j === "l");
  const pismenSamohlasek = samohlasky(p.w).length;
  const why = (k: number): string => {
    if (k === 0) return `Každé slovo, které vyslovíš, má aspoň jednu slabiku. Ve slově „${p.w}“ ji tvoří ${rl} – souhláska, která zní místo samohlásky.`;
    if (p.typ === "dvojhlaska" && k === pismenSamohlasek) return `Takhle vyjde, když se ${dvoj} počítá jako dvě samohlásky. Dvojhláska ${dvoj} je ale jedna slabika: ${p.deleni}.`;
    if (p.typ === "rl" && k === pismenSamohlasek) return `Takhle vyjde, když počítáš jen samohlásky. Ve slově „${p.w}“ ale tvoří slabiku i ${rl}: ${p.deleni}.`;
    const vytleskej = n === 1 ? `Slovo „${p.w}“ vyslovíš jedním tlesknutím.` : `Vytleskej si slovo pomalu: ${p.deleni}.`;
    if (k === n + 1) return `O slabiku víc, než slovo „${p.w}“ má. ${vytleskej}`;
    if (k > n) return `O hodně víc, než slovo „${p.w}“ má. ${vytleskej}`;
    return `Slabik je víc. ${vytleskej}`;
  };
  const h0 = p.typ === "dvojhlaska"
    ? `Ve slově „${p.w}“ je dvojhláska. Zní jako jedna slabika, nebo jako dvě?`
    : `Řekni „${p.w}“ pomalu. Která hláska se dá protáhnout, i když to není samohláska?`;
  const h1 = p.typ === "dvojhlaska"
    ? `Dvojhlásky ou a au vypadají jako dvě písmena, ale vyslovíš je jedním otevřením pusy – tvoří jedinou slabiku. Projdi „${p.w}“ po slabikách a u každé tleskni.`
    : `Slabiku obvykle tvoří samohláska. Kde žádná není, může slabiku utvořit i r nebo l (zkus protáhnout „rrr“ nebo „lll“). Najdi ve slově „${p.w}“ samohlásky i taková r a l a spočítej je.`;
  const explanation = n === 1
    ? `Ve slově „${p.w}“ není žádná samohláska, a přesto má slovo ${slabikAk(1)}: tvoří ji ${rl}. Souhlásky r a l mohou tvořit slabiku i bez samohlásky.`
    : `Slovo „${p.w}“ dělíme ${p.deleni}. Slabiky tu tvoří ${p.jadra.join(", ")}` +
      (p.typ === "dvojhlaska" ? ` – dvojhláska ${dvoj} je jedna slabika, proto má slovo ${slabikAk(n)}.` : ` – r a l mohou tvořit slabiku i bez samohlásky, proto má slovo ${slabikAk(n)}.`);
  return {
    ...choice(
      `Kolik slabik má slovo „${p.w}“?`,
      String(n),
      p.moznosti.filter((k) => k !== n).map((k) => ({ value: String(k), why: why(k) })) as [Distractor, Distractor, Distractor],
      { hints: [h0, h1], explanation },
    ),
    emoji: "🧩",
  };
}

interface Najdi {
  otazka: string;
  spravne: string;
  deleni: string;
  jine: [string, string, string][]; // [slovo, rozdělení, poznámka k chybě]
  hints: [string, string];
}

const L3_NAJDI: Najdi[] = [
  {
    otazka: `Které zvíře má ve jménu ${slabikAk(2)}?`, spravne: "pavouk", deleni: "pa-vouk",
    jine: [["vlk", "vlk", ""], ["veverka", "ve-ver-ka", ""], ["krokodýl", "kro-ko-dýl", ""]],
    hints: [
      "Tleskej jména zvířat z nabídky jedno po druhém. Pozor na zvíře, které má ve jménu ou.",
      "Dvojhláska ou je jedna slabika, i když ji píšeme dvěma písmeny. Tleskni každé jméno pomalu a hledej to, u kterého tleskneš dvakrát.",
    ],
  },
  {
    otazka: `Které zvíře má ve jménu ${slabikAk(1)}?`, spravne: "vlk", deleni: "vlk",
    jine: [["liška", "liš-ka", ""], ["sova", "so-va", ""], ["zajíc", "za-jíc", ""]],
    hints: [
      "Hledej krátké jméno, které vyslovíš jedním tlesknutím. Nevadí, když v něm není samohláska.",
      "Slabiku může utvořit i l nebo r, když chybí samohláska. Řekni každé jméno z nabídky pomalu a hledej to, u kterého tleskneš jen jednou.",
    ],
  },
  {
    otazka: `Které ovoce má ve jménu ${slabikAk(3)}?`, spravne: "meruňka", deleni: "me-ruň-ka",
    jine: [["hruška", "hruš-ka", ""], ["třešně", "třeš-ně", ""], ["hrozen", "hro-zen", ""]],
    hints: [
      "Vyslov každý druh ovoce z nabídky pomalu a tleskej. U kterého tleskneš třikrát?",
      "Najdi v každém jménu ovoce samohlásky – kolik samohlásek, tolik slabik. Hledáš jméno, ve kterém jsou samohlásky tři.",
    ],
  },
  {
    otazka: `Která školní věc má ve jménu ${slabikAk(3)}?`, spravne: "pravítko", deleni: "pra-vít-ko",
    jine: [["penál", "pe-nál", ""], ["křída", "kří-da", ""], ["guma", "gu-ma", ""]],
    hints: [
      "Představ si svou lavici a tleskej jména věcí z nabídky. Která zabere tři tlesknutí?",
      "Najdi v každém jménu školní věci samohlásky a spočítej je. Pozor, dlouhé í nebo á je pořád jen jedna samohláska. Hledáš jméno se třemi.",
    ],
  },
  {
    otazka: `Které jídlo má ve jménu ${slabikAk(4)}?`, spravne: "palačinka", deleni: "pa-la-čin-ka",
    jine: [["polévka", "po-lév-ka", ""], ["rohlík", "roh-lík", ""], ["knedlík", "kned-lík", ""]],
    hints: [
      "Tleskej jména jídel z nabídky. Hledáš to nejdelší – kolikrát u něj tleskneš?",
      "Spočítej samohlásky v každém jménu jídla z nabídky. Jen jedno jídlo jich má čtyři – každá samohláska je jedna slabika.",
    ],
  },
  {
    otazka: `Který kus oblečení má ve jménu ${slabikAk(3)}?`, spravne: "ponožky", deleni: "po-nož-ky",
    jine: [["tričko", "trič-ko", ""], ["bunda", "bun-da", ""], ["šaty", "ša-ty", ""]],
    hints: [
      "Vyslov jména oblečení z nabídky pomalu. U kterého tleskneš třikrát?",
      "V každém jménu oblečení najdi samohlásky – o, a, y, i… Jméno se třemi samohláskami má tři slabiky, ostatní jen dvě.",
    ],
  },
  {
    otazka: `Který dopravní prostředek má ve jménu ${slabikAk(3)}?`, spravne: "letadlo", deleni: "le-tad-lo",
    jine: [["vlak", "vlak", ""], ["auto", "au-to", " – au je dvojhláska, tedy jedna slabika"], ["loď", "loď", ""]],
    hints: [
      "Tleskej jména dopravních prostředků z nabídky. Pozor na slovo, které začíná dvojhláskou.",
      "Au vypadá jako dvě samohlásky, ale je to jedna slabika. Tleskni každé jméno pomalu a hledej to, u kterého tleskneš třikrát.",
    ],
  },
  {
    otazka: `Které zvíře má ve jménu ${slabikAk(3)}?`, spravne: "žirafa", deleni: "ži-ra-fa",
    jine: [["pavouk", "pa-vouk", " – ou je dvojhláska, tedy jedna slabika"], ["krtek", "kr-tek", " – slabiku tu tvoří i r"], ["slon", "slon", ""]],
    hints: [
      "Tleskej jména zvířat z nabídky. Pozor: počet samohlásek tu může klamat.",
      "Dvojhláska ou je jedna slabika a r může utvořit slabiku samo. Tleskni každé jméno pomalu a hledej to, u kterého tleskneš třikrát.",
    ],
  },
];

function najdiL3(x: Najdi): PracticeTask {
  const n = x.deleni.split("-").length;
  const distraktory = x.jine.map(([slovo, deleni, pozn]) => {
    const k = deleni.split("-").length;
    if (k === n) throw new Error(`L3 ${x.otazka}: ${slovo} má stejný počet slabik jako klíč`);
    const popis = k === 1 ? `jen ${slabikAk(1)} – vyslovíš ho jedním tlesknutím` : `${slabikAk(k)}: ${deleni}`;
    return { value: slovo, why: `Slovo „${slovo}“ má ${popis}${pozn}.` };
  }) as [Distractor, Distractor, Distractor];
  return {
    ...choice(x.otazka, x.spravne, distraktory, {
      hints: x.hints,
      explanation: n === 1
        ? `Slovo „${x.spravne}“ vyslovíš jedním tlesknutím – má ${slabikAk(1)}, i když v něm není samohláska (slabiku tvoří l). Ostatní slova z nabídky mají slabiky dvě.`
        : `Slovo „${x.spravne}“ dělíme ${x.deleni} – má tedy ${slabikAk(n)}. Ostatní slova z nabídky mají slabik jiný počet.`,
    }),
    emoji: "🔎",
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(spocitej);
  if (level === 2) return shuffle(L2).map(rozdel);
  return shuffle([...L3_POCET.map(pocetL3), ...L3_NAJDI.map(najdiL3)]);
}

export const SLABIKY: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky",
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky",
    title: "Slabika, rozdělení na slabiky",
    studentTitle: "Tleskej slabiky",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Naučíš se, co je slabika a jak slova dělit.",
    keywords: ["slabika", "rozdělení", "samohláska", "máma", "škola", "slabikování"],
    goals: [
      "Vědět, že slabika je část slova s jednou samohláskou.",
      "Spočítat slabiky ve slově.",
      "Umět slovo správně rozdělit na slabiky.",
    ],
    boundaries: ["Běžná slova 2. třídy.", "Bez složitých souhláskových shluků."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každou slabiku tvoří jedna samohláska (nebo dvojhláska ou/au, nebo r či l). Tleskej a počítej.",
      steps: ["Řekni slovo pomalu a tleskej.", "Najdi samohlásky a dvojhlásky.", "Kolik jich je, tolik slabik."],
      commonMistake: "Počítat písmena místo samohlásek, nebo počítat dvojhlásku ou/au jako dvě slabiky.",
      example: "Máma: á + a = 2 slabiky. Auto: au + o = 2 slabiky. Vlk: slabiku tvoří l = 1 slabika.",
    },
  },
];
