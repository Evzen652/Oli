import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

/**
 * Přepsáno 2026-09-11 (inventura obsahu): téma bylo celé Ano/Ne (i L2 a L3),
 * s jednou obecnou nápovědou a bez zpětné vazby. Převody na gramy
 * (1 kg = 1000 g, 2 kg = 2000 g) navíc překračovaly číselný obor 2. ročníku
 * (do 100), proto z tématu vypadly.
 *
 * Teď výběr ze 4 možností na všech úrovních, úrovně disjunktní:
 *   L1 — rozpoznání: kterou jednotkou co měřit (cm / m / kg / l),
 *        základní vztahy 1 m = 100 cm a 1 l = 10 dl.
 *   L2 — aplikace: litry ↔ decilitry v násobcích, doplnění do metru.
 *   L3 — transfer: půl/čtvrt/třičtvrtě metru a litru, dva kroky
 *        (z metru ustřihnu…, z litru naliju několik sklenic…).
 */

const CM = "centimetr";
const M = "metr";
const KG = "kilogram";
const L = "litr";

interface Predmet {
  /** Otázka bez prefixu, např. „délku tužky“. */
  co: string;
  /** Předmět v 1. pádě pro nápovědy („tužka“). */
  nom: string;
  unit: typeof CM | typeof M | typeof KG | typeof L;
  /** Konkrétní opora pro odhad velikosti — jde do velké nápovědy. */
  opora: string;
}

const PREDMETY: Predmet[] = [
  { co: "délku tužky", nom: "Tužka", unit: CM, opora: "Tužka se ti vejde do dlaně." },
  { co: "délku gumy", nom: "Guma", unit: CM, opora: "Guma je menší než tvůj palec." },
  { co: "šířku sešitu", nom: "Sešit", unit: CM, opora: "Sešit leží celý na lavici a je užší než tvoje předloktí." },
  { co: "délku lžičky", nom: "Lžička", unit: CM, opora: "Lžičku udržíš v jedné ruce a je kratší než tvoje ruka." },
  { co: "délku školní chodby", nom: "Chodba", unit: M, opora: "Chodbu přejdeš až po mnoha krocích." },
  { co: "výšku stromu", nom: "Strom", unit: M, opora: "Strom je mnohem vyšší než dospělý člověk." },
  { co: "délku bazénu", nom: "Bazén", unit: M, opora: "Bazén přeplaveš až po mnoha tempech." },
  { co: "délku fotbalového hřiště", nom: "Hřiště", unit: M, opora: "Přes hřiště musíš dlouho běžet." },
  { co: "hmotnost melounu", nom: "Meloun", unit: KG, opora: "Meloun unese dítě jen oběma rukama." },
  { co: "hmotnost pytle brambor", nom: "Pytel brambor", unit: KG, opora: "Pytel brambor se nosí z obchodu a je těžký." },
  { co: "hmotnost tašky s nákupem", nom: "Taška s nákupem", unit: KG, opora: "Tašku s nákupem pokládá prodavačka na váhu." },
  { co: "hmotnost psa", nom: "Pes", unit: KG, opora: "Psa váží veterinář na velké váze." },
  { co: "objem vody v kbelíku", nom: "Kbelík", unit: L, opora: "Do kbelíku se vejde hodně vody na mytí podlahy." },
  { co: "objem vody ve vaně", nom: "Vana", unit: L, opora: "Do vany se vejde tolik vody, že se v ní vykoupeš." },
  { co: "objem vody v konvici", nom: "Konvice", unit: L, opora: "Z konvice naliješ čaj pro celou rodinu." },
  { co: "objem vody v akváriu", nom: "Akvárium", unit: L, opora: "V akváriu plavou rybičky a vody je v něm hodně." },
];

function proc(p: Predmet, u: string): string {
  const oCo = p.unit === KG ? "kolik to váží" : "kolik vody se tam vejde";
  if (u === CM) return p.unit === M
    ? `Centimetr je na ${p.co} moc malá jednotka — musel bys napočítat stovky centimetrů.`
    : `Centimetr měří délku. Tady ale nejde o délku — ptáme se, ${oCo}.`;
  if (u === M) return p.unit === CM
    ? `Metr je na ${p.co} moc velká jednotka — ${p.nom.toLowerCase()} je mnohem kratší než metr.`
    : `Metr měří délku. Tady ale nejde o délku — ptáme se, ${oCo}.`;
  if (u === KG) return p.unit === L
    ? "Kilogram měří, kolik co váží. Tady se ale ptáme, kolik vody se dovnitř vejde."
    : "Kilogram měří, kolik co váží. Tady se ale ptáme, jak je to dlouhé.";
  return p.unit === KG
    ? "Litr měří, kolik tekutiny se kam vejde. Tady se ale ptáme, kolik to váží."
    : "Litr měří, kolik tekutiny se kam vejde. Tady se ale ptáme, jak je to dlouhé.";
}

function jednotka(p: Predmet): PracticeTask {
  const vse = [CM, M, KG, L];
  const d = vse.filter((u) => u !== p.unit).map((u) => ({ value: u, why: proc(p, u) })) as [Distractor, Distractor, Distractor];
  const velicina = p.unit === CM || p.unit === M ? "délku" : p.unit === KG ? "hmotnost (kolik co váží)" : "objem (kolik se čeho vejde)";
  const h1 =
    p.unit === CM ? `${p.opora} Měříš délku něčeho malého, takže vyber menší jednotku délky.`
    : p.unit === M ? `${p.opora} Měříš délku něčeho velkého, takže vyber větší jednotku délky.`
    : p.unit === KG ? `${p.opora} Zajímá tě, jak je to těžké. Vyber jednotku, kterou ukazuje váha.`
    : `${p.opora} Zajímá tě, kolik tekutiny se vejde dovnitř. Vyber jednotku, kterou najdeš na krabici mléka.`;
  return choice(`Jakou jednotkou změříš ${p.co}?`, p.unit, d, {
    hints: [`Ptáš se na ${p.co}. Měříš délku, hmotnost, nebo objem — a jak velké to asi je?`, h1],
    explanation: `Měříme ${velicina}. ${p.opora} Proto se hodí ${p.unit}.`,
  });
}

// ── L1 fakta ────────────────────────────────────────────────────────────────

const L1_FAKTA: PracticeTask[] = [
  choice(
    "Kolik centimetrů má 1 metr?",
    "100 cm",
    [
      { value: "10 cm", why: "10 cm je jen decimetr — asi šířka dlaně. Metr je desetkrát delší." },
      { value: "1000 cm", why: "Tisíc centimetrů by byl pás dlouhý jako deset metrů. Jeden metr má centimetrů méně." },
      { value: "50 cm", why: "50 cm je jen půl metru." },
    ],
    {
      hints: [
        "Představ si metrový pásek s dílky po centimetru. Kolik dílků na něm je?",
        "Na metru je deset úseků po deseti centimetrech. Kolik je deset desítek? Spočítej po desítkách.",
      ],
      explanation: "Metr má sto centimetrů: deset úseků po 10 cm, 10 × 10 = 100.",
    },
  ),
  choice(
    "Kolik decilitrů má 1 litr?",
    "10 dl",
    [
      { value: "100 dl", why: "Sto patří k metru (1 m = 100 cm). Litr má decilitrů méně." },
      { value: "5 dl", why: "5 dl je jen půl litru." },
      { value: "1 dl", why: "1 dl je jeden malý hrneček. Litr jich naplní víc." },
    ],
    {
      hints: [
        "Litr mléka rozlij do hrníčků po jednom decilitru. Kolik hrníčků naplníš?",
        "Předpona deci- znamená desetinu. Decilitr je tedy jedna desetina litru — kolik desetin dá celek?",
      ],
      explanation: "Decilitr je desetina litru, takže celý litr má deset decilitrů.",
    },
  ),
];

// ── L2: aplikace v oboru do 100 ─────────────────────────────────────────────

function litryNaDl(n: number): PracticeTask {
  const x = n * 10;
  return choice(
    `${n} l = ? dl`,
    `${x} dl`,
    [
      { value: `${n} dl`, why: `Číslo zůstalo stejné. Decilitr je menší než litr, takže decilitrů musí být víc než ${n}.` },
      { value: `${n + 10} dl`, why: `Přičetl jsi 10. Každý z těch ${n} litrů má 10 dl, takže se násobí, ne přičítá.` },
      { value: `${n * 100} dl`, why: "Sto patří k metru (1 m = 100 cm). Litr má jen deset decilitrů." },
    ],
    {
      hints: [
        `Kolik decilitrů má jeden litr? A ty máš ${n} ${plural(n, "litr", "litry", "litrů")}.`,
        `Každý z těch ${n} litrů rozlij na decilitry. Sečti ${n}krát po sobě počet decilitrů v jednom litru, nebo použij násobilku deseti.`,
      ],
      explanation: `1 l = 10 dl, takže ${n} l = ${n} × 10 = ${x} dl.`,
    },
  );
}

function dlNaLitry(n: number): PracticeTask {
  const x = n * 10;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${x} l`, why: `Číslo zůstalo stejné. Litr je větší než decilitr, takže litrů musí být méně než ${x}.` },
    { value: `${n + 1} l`, why: `To by bylo ${(n + 1) * 10} dl. Spočítej, kolikrát se 10 dl vejde do ${x} dl.` },
    { value: `${n - 1} l`, why: `To by bylo ${(n - 1) * 10} dl. Spočítej, kolikrát se 10 dl vejde do ${x} dl.` },
  ];
  return choice(`${x} dl = ? l`, `${n} l`, d, {
    hints: [
      `Kolik decilitrů dá dohromady jeden litr? Kolikrát se to vejde do ${x} dl?`,
      `Rozděl ${x} dl na hromádky po deseti decilitrech. Každá hromádka je jeden litr — kolik hromádek máš?`,
    ],
    explanation: `10 dl = 1 l. Do ${x} dl se deset decilitrů vejde ${n}krát, proto ${x} dl = ${n} l.`,
  });
}

function doMetru(x: number): PracticeTask {
  const key = 100 - x;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${x} cm`, why: `${x} cm už máš. Otázka se ptá, kolik ještě chybí.` },
    key > 10
      ? { value: `${key - 10} cm`, why: `S tímhle bys měl jen ${100 - 10} cm, na celý metr by pořád 10 cm chybělo.` }
      : { value: `${key + 10} cm`, why: `S tímhle bys měl ${x + key + 10} cm, to je víc než metr.` },
    { value: `${10 - x / 10} cm`, why: "Počítal jsi, jako by metr měl jen 10 cm. To má decimetr; metr má centimetrů víc." },
  ];
  return choice(`Máš ${x} cm provázku. Kolik cm chybí do 1 m?`, `${key} cm`, d, {
    hints: [
      `Kolik centimetrů má celý metr? Ty máš zatím ${x} cm.`,
      `Doplňuj ${x} cm po desítkách, dokud nedojdeš na celý metr. Spočítej, kolik desítek centimetrů jsi přidal.`,
    ],
    explanation: `1 m = 100 cm. Chybí 100 − ${x} = ${key} cm, protože ${x} + ${key} = 100.`,
  });
}

// ── L3: části jednotek a dva kroky ──────────────────────────────────────────

const L3_CASTI: PracticeTask[] = [
  choice("Kolik centimetrů je půl metru?", "50 cm", [
    { value: "25 cm", why: "25 cm je čtvrt metru, ne půl." },
    { value: "5 cm", why: "Půlku jsi vzal z 10 cm, ale metr má centimetrů mnohem víc." },
    { value: "20 cm", why: "Dvakrát 20 cm je jen 40 cm, to není celý metr." },
  ], {
    hints: [
      "Rozstřihni metrový pásek na dvě stejné části. Jak dlouhá je jedna?",
      "Metr má sto centimetrů. Půl znamená rozdělit na dvě stejné poloviny — kolik je polovina ze sta?",
    ],
    explanation: "1 m = 100 cm, polovina ze 100 je 50, protože 50 + 50 = 100.",
  }),
  choice("Kolik centimetrů je čtvrt metru?", "25 cm", [
    { value: "50 cm", why: "50 cm je půl metru. Čtvrt je ještě dvakrát menší." },
    { value: "40 cm", why: "Čtyřikrát 40 cm je víc než metr." },
    { value: "4 cm", why: "Čtvrt neznamená 4 centimetry, ale jednu ze čtyř stejných částí metru." },
  ], {
    hints: [
      "Rozstřihni metr na čtyři stejné kousky. Jak dlouhý je jeden?",
      "Nejdřív metr rozpůl, pak každou polovinu ještě jednou rozpůl. Kolik centimetrů má jeden takový kousek?",
    ],
    explanation: "Půl metru je 50 cm a polovina z toho je 25 cm. Čtyři čtvrtiny: 25 + 25 + 25 + 25 = 100 cm.",
  }),
  choice("Kolik centimetrů je třičtvrtě metru?", "75 cm", [
    { value: "25 cm", why: "25 cm je jen jedna čtvrtina. Třičtvrtě jsou tři takové kousky." },
    { value: "50 cm", why: "50 cm jsou dvě čtvrtiny (půl metru). Chybí ještě jedna čtvrtina." },
    { value: "30 cm", why: "Tři čtvrtiny nejsou 30 cm — čtvrtina metru je delší než 10 cm." },
  ], {
    hints: [
      "Kolik centimetrů je jedna čtvrtina metru? Třičtvrtě jsou tři takové kousky.",
      "Vezmi jednu čtvrtinu metru třikrát za sebou. Nebo od celého metru odeber jednu čtvrtinu.",
    ],
    explanation: "Čtvrt metru = 25 cm. Třičtvrtě = 25 + 25 + 25 = 75 cm (nebo 100 − 25).",
  }),
  choice("Kolik decilitrů je půl litru?", "5 dl", [
    { value: "50 dl", why: "Půlku jsi vzal ze 100, jako u metru. Litr má ale jen 10 dl." },
    { value: "2 dl", why: "Dvakrát 2 dl jsou jen 4 dl, to není celý litr." },
    { value: "10 dl", why: "10 dl je celý litr, ne půl." },
  ], {
    hints: [
      "Rozlij litr mléka napůl do dvou stejných hrnků. Kolik decilitrů bude v jednom?",
      "Litr má deset decilitrů. Rozděl je na dvě stejné části — kolik je polovina z deseti?",
    ],
    explanation: "1 l = 10 dl a polovina z 10 je 5, protože 5 + 5 = 10.",
  }),
  choice("Kolik decilitrů je jeden a půl litru?", "15 dl", [
    { value: "10 dl", why: "10 dl je jen jeden litr. Chybí ještě půl litru." },
    { value: "5 dl", why: "5 dl je jen ta půlka. Přidat musíš i celý litr." },
    { value: "11 dl", why: "Půl litru nejsou 1 dl. Půl litru je polovina z deseti decilitrů." },
  ], {
    hints: [
      "Rozděl to na celý litr a na půl litru. Kolik decilitrů má každá část?",
      "Celý litr má deset decilitrů. Půl litru je polovina z toho. Obě části nakonec sečti.",
    ],
    explanation: "1 l = 10 dl, půl litru = 5 dl. Dohromady 10 + 5 = 15 dl.",
  }),
  choice("Kolik decilitrů má dva a půl litru?", "25 dl", [
    { value: "20 dl", why: "20 dl jsou jen dva celé litry. Chybí ještě půl litru." },
    { value: "7 dl", why: "Sečetl jsi 2 + 5. Dva litry ale nejsou 2 dl — každý litr má 10 dl." },
    { value: "250 dl", why: "Počítal jsi, jako by litr měl 100 dl. Má jich jen deset." },
  ], {
    hints: [
      "Rozděl to na dva celé litry a na půl litru. Kolik decilitrů má každá část?",
      "Dva litry jsou dvakrát deset decilitrů. Půl litru je polovina z deseti. Obě části nakonec sečti.",
    ],
    explanation: "2 l = 20 dl, půl litru = 5 dl. Dohromady 20 + 5 = 25 dl.",
  }),
];

function ustrihni(x: number): PracticeTask {
  const key = 100 - x;
  return choice(`Máš 1 m provázku. Ustřihneš ${x} cm. Kolik cm zbyde?`, `${key} cm`, [
    { value: `${x} cm`, why: `${x} cm je kus, který jsi ustřihl. Otázka se ptá na zbytek.` },
    { value: `${key + 10} cm`, why: `Tady se odčítá přes desítku a jedna desítka ti přebyla. Zkontroluj: zbytek a ustřižený kus musí dát dohromady přesně 1 m.` },
    { value: `${key - 1} cm`, why: `O centimetr méně. Zkontroluj jednotky: ${x % 10} a kolik k tomu chybí do celé desítky.` },
  ], {
    hints: [
      `Než začneš odčítat ${x} cm, převeď si 1 m na centimetry.`,
      `Metr má sto centimetrů. Od toho odeber ${x} cm — nejdřív desítky (${x - (x % 10)}), pak jednotky (${x % 10}) přes desítku.`,
    ],
    explanation: `1 m = 100 cm. Zbyde 100 − ${x} = ${key} cm. Zkouška: ${key} + ${x} = 100.`,
  });
}

function sklenice(k: number, s: number): PracticeTask {
  const vylito = k * s;
  const key = 10 - vylito;
  const skl = plural(k, "sklenici", "sklenice", "sklenic");
  const cands: Distractor[] = [
    { value: `${vylito} dl`, why: `Tolik jsi nalil do sklenic. Otázka se ptá, kolik zbyde v láhvi.` },
    { value: `${10 - s} dl`, why: `Odečetl jsi jen jednu sklenici. Nalil jsi jich ale ${k}.` },
    { value: `${100 - vylito} dl`, why: "Počítal jsi, jako by litr měl 100 dl. Litr má jen deset decilitrů." },
    { value: `${key + 1} dl`, why: `O decilitr víc. Spočítej znovu, kolik je ${k} × ${s} dl.` },
    { value: `${key + 2} dl`, why: `O dva decilitry víc. Spočítej znovu, kolik je ${k} × ${s} dl.` },
  ];
  const seen = new Set<string>([`${key} dl`]);
  const d = cands.filter((c) => (seen.has(c.value) ? false : (seen.add(c.value), true))).slice(0, 3) as [Distractor, Distractor, Distractor];
  return choice(`Láhev má 1 l. Naliješ ${k} ${skl} po ${s} dl. Kolik dl zbyde?`, `${key} dl`, d, {
    hints: [
      `Kolik decilitrů naliješ do ${k} ${plural(k, "sklenice", "sklenic", "sklenic")}, když do každé dáš ${s}?`,
      `Nejdřív spočítej ${k} × ${s}, to je vše nalité v decilitrech. Pak si litr převeď na decilitry a nalité od nich odečti.`,
    ],
    explanation: `Do sklenic naliješ ${k} × ${s} = ${vylito} dl. 1 l = 10 dl, zbyde 10 − ${vylito} = ${key} dl.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle([...PREDMETY.map(jednotka), ...L1_FAKTA]);
  if (level === 2)
    return shuffle([
      ...[2, 3, 4, 5, 6, 7, 8, 9].map(litryNaDl),
      ...[2, 3, 4, 5, 6, 7, 8, 9].map(dlNaLitry),
      ...[10, 20, 30, 40, 60, 70, 80, 90].map(doMetru),
    ]);
  return shuffle([
    ...L3_CASTI,
    ...[35, 45, 15, 65, 28, 72, 56, 83].map(ustrihni),
    ...([[2, 2], [3, 2], [3, 1], [2, 3], [3, 3], [2, 4]] as [number, number][]).map(([k, s]) => sklenice(k, s)),
  ]);
}

export const JEDNOTKYDLKYHMOTNOSTIOBJEMU: TopicMetadata[] = [
  {
    id: "g2-mat-jednotky",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-jednotky-delky-cm-m-hmotnosti-kg-objemu-l",
    title: "Jednotky délky (cm, m), hmotnosti (kg) a objemu (l)",
    studentTitle: "Metry, kila, litry",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš vztahy mezi cm, m, kg a litry.",
    keywords: ["jednotky", "délka", "hmotnost", "objem", "cm", "metr", "kilogram", "litr"],
    goals: [
      "Znát vztah 1 m = 100 cm.",
      "Vybrat vhodnou jednotku: cm, m, kg, nebo l.",
      "Znát vztah 1 l = 10 dl.",
      "Rozpoznat poloviny a čtvrtiny základních jednotek.",
    ],
    boundaries: ["Pouze základní vztahy cm/m a l/dl, obor do 100.", "Bez gramů a bez složitějších přepočtů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zapamatuj si: 1 m = 100 cm, 1 l = 10 dl. Délka se měří v cm nebo m, hmotnost v kg, objem v l. Polovina = ÷ 2, čtvrtina = ÷ 4.",
      steps: [
        "1 metr má 100 centimetrů.",
        "1 litr má 10 decilitrů.",
        "Délka → cm nebo m, hmotnost → kg, objem → l.",
        "Polovina/čtvrtina: vezmi základní vztah a vyděl 2 nebo 4.",
      ],
      commonMistake: "Záměna 100 a 10 — metr má 100 cm, ale litr má jen 10 dl.",
      example: "3 l = 30 dl (3 × 10). Půl metru = 50 cm. Meloun vážíme v kilogramech.",
    },
  },
];
