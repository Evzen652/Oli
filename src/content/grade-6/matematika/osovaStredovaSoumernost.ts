/**
 * Matematika 6. ročník — Osová a středová souměrnost.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one se čtyřmi možnostmi.
 *
 *  • L1 — rozpoznání (navazuje na 5. ročník): počet os souměrnosti útvaru
 *    nebo písmena, středově / osově souměrná písmena, útvar podle kombinace
 *    vlastností (jen střed / jen osa / obojí — klíč se střídá). Lichoběžník
 *    se nepoužívá, zavádí se až v 7. ročníku.
 *    Znění začíná „Kolik…“ / „Které…“ / „Který…“, nepadne v nich „bod“.
 *  • L2 — obraz bodu jedním krokem (svislá osa, vodorovná osa, střed S)
 *    a vzdálenost bodu od obrazu. Kontexty: bod, vrchol trojúhelníku,
 *    Lodě, záhon, zrcadlo.
 *  • L3 — inverze a dva kroky: hledání středu, hledání vzoru, hledání osy,
 *    dvě souměrnosti za sebou.
 *
 * Síť je jen v 1. kvadrantu (0–12): záporná čísla patří do 7. ročníku.
 * Poloha bodu se v každém zadání vysvětlí slovy, takže úloha jde vyřešit
 * bez obrázku. Každý distraktor je výsledek konkrétní chyby spočítaný
 * z týchž čísel; kombinace, kde by distraktor vyšel ze sítě nebo splynul
 * s klíčem, se zahodí (`buildChoiceTask` → null, `losUlohy` losuje znovu).
 *
 * Slova „osa“ a „políčko“ v rejstříku `NOUNS` nejsou, proto `plural()`
 * s tvary vypsanými tady.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { cis, rnd, pick, shuffle, buildChoiceTask as sestavUlohu, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

/**
 * `buildChoiceTask` bez automatického dodatku „Čísla ze zadání: …“. U souřadnic
 * slévá sloupec, řádek a polohu osy do jednoho seznamu bez významu a metodu
 * nijak neučí (stejně jako v tabulkyADiagramy / znakyDelitelnosti).
 */
function buildChoiceTask(...args: Parameters<typeof sestavUlohu>): PracticeTask | null {
  const t = sestavUlohu(...args);
  if (t) t.hints = (t.hints ?? []).map((h) => h.replace(/ Čísla ze zadání: .*\.$/, ""));
  return t;
}

// ── Geometrie ve čtvercové síti ─────────────────────────────────────────────
type Bod = [number, number];
type Smer = "svisla" | "vodorovna";
interface Osa {
  smer: Smer;
  k: number;
}

const MAX = 12;
const vSiti = (b: Bod): boolean => b.every((c) => Number.isInteger(c) && c >= 0 && c <= MAX);
const zap = (b: Bod): string => `[${cis(b[0])}; ${cis(b[1])}]`;
const shoda = (a: Bod, b: Bod): boolean => a[0] === b[0] && a[1] === b[1];
const policek = (n: number): string => `${cis(n)} ${plural(n, "políčko", "políčka", "políček")}`;
const poloha = (b: Bod): string =>
  `${policek(b[0])} vpravo a ${policek(b[1])} nahoru od levého dolního rohu sítě`;
/** Index souřadnice, kterou osa mění: svislá osa mění sloupec (0). */
const idx = (s: Smer): 0 | 1 => (s === "svisla" ? 0 : 1);
const jina = (s: Smer): Smer => (s === "svisla" ? "vodorovna" : "svisla");
const osy = (n: number): string => `${cis(n)} ${plural(n, "osa", "osy", "os")}`;

function podleOsy(b: Bod, o: Osa): Bod {
  const r: Bod = [b[0], b[1]];
  const i = idx(o.smer);
  r[i] = 2 * o.k - b[i];
  return r;
}

function podleStredu(b: Bod, s: Bod): Bod {
  return [2 * s[0] - b[0], 2 * s[1] - b[1]];
}

function sHodnotou(b: Bod, i: 0 | 1, v: number): Bod {
  const r: Bod = [b[0], b[1]];
  r[i] = v;
  return r;
}

/** Slova pro sloupec / řádek v potřebných pádech. */
interface Slova {
  nom: string; // sloupec
  ins: string; // sloupcem
  ve: string; // ve sloupci
  dat: string; // ke sloupci
  gen: string; // sloupce
  adj: string; // svislá
  adjGen: string; // svislé
  druhe: string; // „řádek“ — ta souřadnice, která se nemění
  poradi: string; // „první“ souřadnice
}

const SLOVA: Record<Smer, Slova> = {
  svisla: {
    nom: "sloupec", ins: "sloupcem", ve: "ve sloupci", dat: "ke sloupci", gen: "sloupce",
    adj: "svislá", adjGen: "svislé", druhe: "řádek", poradi: "první",
  },
  vodorovna: {
    nom: "řádek", ins: "řádkem", ve: "v řádku", dat: "k řádku", gen: "řádku",
    adj: "vodorovná", adjGen: "vodorovné", druhe: "sloupec", poradi: "druhou",
  },
};

const velke = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const osaVeta = (o: Osa): string => {
  const w = SLOVA[o.smer];
  return `Osa souměrnosti je ${w.adj} a prochází ${w.ins} ${cis(o.k)} (všemi body s ${w.poradi} souřadnicí ${cis(o.k)}).`;
};
const linie = (s: Smer, n: number): string => `${SLOVA[s].nom} ${cis(n)}`;

/** Jak daleko a kterým směrem leží bod od středu (i nulový posun). */
function odStredu(b: Bod, s: Bod): string {
  const dx = b[0] - s[0];
  const dy = b[1] - s[1];
  const x = dx === 0 ? "ve stejném sloupci" : `${policek(Math.abs(dx))} ${dx > 0 ? "vpravo" : "vlevo"}`;
  const y = dy === 0 ? "ve stejném řádku" : `${policek(Math.abs(dy))} ${dy > 0 ? "nahoru" : "dolů"}`;
  return `${x}, ${y}`;
}

/** „sloupec 5 − 3 = 2, řádek 6 + 2 = 8“ — výpočet obrazu podle středu. */
function krokStred(b: Bod, s: Bod): string {
  const cast = (c: number, d: number): string =>
    d === 0 ? `${cis(c)} (beze změny)` : `${cis(c)} ${d > 0 ? "−" : "+"} ${cis(Math.abs(d))} = ${cis(c - d)}`;
  return `sloupec ${cast(s[0], b[0] - s[0])}, řádek ${cast(s[1], b[1] - s[1])}`;
}

/** „6 + 3 = 9“ — výpočet měněné souřadnice podle osy. */
function krokOsa(b: Bod, o: Osa): string {
  const d = b[idx(o.smer)] - o.k;
  if (d === 0) return `${cis(o.k)} (bod leží na ose, nemění se)`;
  return `${cis(o.k)} ${d > 0 ? "−" : "+"} ${cis(Math.abs(d))} = ${cis(o.k - d)}`;
}

// ── Výběr distraktorů ──────────────────────────────────────────────────────
interface Kand {
  b: Bod;
  why: string;
}

/**
 * Z kandidátů nechá jen ty v síti, různé od klíče a od bodů ze zadání.
 * `vyvazit` (L3): kandidáty zamíchá a dopředu dá jeden větší a jeden menší
 * než klíč, aby klíč nebyl systematicky krajní možností.
 */
function vyberBody(key: Bod, kand: (Kand | null)[], zakazane: Bod[], vyvazit: boolean): Distractor[] {
  const ok: Kand[] = [];
  for (const c of kand) {
    if (!c || !vSiti(c.b) || shoda(c.b, key)) continue;
    if (zakazane.some((z) => shoda(z, c.b)) || ok.some((o) => shoda(o.b, c.b))) continue;
    ok.push(c);
  }
  let poradi = ok;
  if (vyvazit) {
    const mic = shuffle(ok);
    const suma = (b: Bod) => b[0] + b[1];
    const vetsi = mic.find((c) => suma(c.b) > suma(key));
    const mensi = mic.find((c) => suma(c.b) < suma(key));
    const prvni = [vetsi, mensi].filter((c): c is Kand => !!c);
    poradi = [...prvni, ...mic.filter((c) => !prvni.includes(c))];
  }
  return poradi.map((c) => ({ value: zap(c.b), why: c.why }));
}

/** Nekonečný zdroj prvků: zamíchá, projde všechny, zamíchá znovu. */
function cyklus<T>(xs: T[]): () => T {
  let poradi = shuffle(xs);
  let i = 0;
  return () => {
    if (i === poradi.length) {
      poradi = shuffle(xs);
      i = 0;
    }
    return poradi[i++];
  };
}

/** Šablony se střídají dokola (rovnoměrně), každá losuje, dokud neuspěje. */
function rotace(sablony: (() => PracticeTask | null)[]): () => PracticeTask {
  const poradi = shuffle(sablony);
  let n = 0;
  return () => losUlohy(poradi[n++ % poradi.length]);
}

const PISMENA_L3 = ["B", "C", "D", "E", "F", "G", "H", "K", "M", "P"];

// ── L1: rozpoznání souměrných útvarů a písmen ──────────────────────────────
interface Utvar {
  nazev: string; // v otázce
  kratce: string; // v nápovědě (4. pád = 1. pád)
  os: number;
  prehyby: string;
  /** Jak útvar zkoušet přehnout (velká nápověda). */
  zkousej: string;
  /** Vysvětlení pro útvar bez osy (os = 0). */
  bezOs?: string;
  chyby: [number, string][];
}

const ZKOUSEJ_CTYRUHELNIK = "svisle, vodorovně i podél obou úhlopříček";
const ZKOUSEJ_TROJUHELNIK = "podél spojnice každého vrcholu se středem protější strany";
const ZKOUSEJ_PISMENO = "svisle i vodorovně, vždy přesně uprostřed";

const UTVARY: Utvar[] = [
  {
    nazev: "čtverec", kratce: "čtverec", os: 4,
    prehyby: "svislý a vodorovný přehyb středem a přehyby podél obou úhlopříček",
    zkousej: ZKOUSEJ_CTYRUHELNIK,
    chyby: [
      [2, "Tady se počítají jen úhlopříčky, nebo jen spojnice středů protějších stran. Čtverec jde přeložit podél obou úhlopříček i podél obou spojnic středů stran."],
      [3, "Tři osy má rovnostranný trojúhelník. Čtverec jde přeložit svisle, vodorovně i podél obou úhlopříček."],
      [1, "Čtverec jde přeložit napůl víc způsoby než jedním: svisle, vodorovně i podél obou úhlopříček."],
    ],
  },
  {
    nazev: "obdélník, který není čtverec", kratce: "obdélník", os: 2,
    prehyby: "svislý a vodorovný přehyb středem; přehyb podél úhlopříčky nefunguje",
    zkousej: ZKOUSEJ_CTYRUHELNIK,
    chyby: [
      [4, "Úhlopříčky obdélníku osami nejsou: po přeložení podél úhlopříčky rohy na sebe nesednou. Osy jsou jen dvě spojnice středů protějších stran."],
      [1, "Obdélník jde přeložit napůl svisle i vodorovně, nejen jedním způsobem."],
      [0, "Obdélník osy má: po přeložení podél spojnice středů protějších stran obě poloviny na sebe přesně padnou."],
    ],
  },
  {
    nazev: "rovnostranný trojúhelník", kratce: "rovnostranný trojúhelník", os: 3,
    prehyby: "přehyb každým vrcholem a středem protější strany, u všech tří vrcholů",
    zkousej: ZKOUSEJ_TROJUHELNIK,
    chyby: [
      [1, "Jednu osu má rovnoramenný trojúhelník. Rovnostranný má všechny strany stejně dlouhé, a tak osa vede každým ze tří vrcholů."],
      [2, "Osa vede každým vrcholem a středem protější strany. Vrcholy jsou tři, a tak jsou tři i osy."],
      [0, "Rovnostranný trojúhelník jde přeložit napůl podél spojnice vrcholu a středu protější strany, takže osy má."],
    ],
  },
  {
    nazev: "rovnoramenný trojúhelník, který není rovnostranný", kratce: "rovnoramenný trojúhelník", os: 1,
    prehyby: "jen přehyb vrcholem mezi rameny a středem základny",
    zkousej: ZKOUSEJ_TROJUHELNIK,
    chyby: [
      [3, "Tři osy má jen rovnostranný trojúhelník. Rovnoramenný má stejně dlouhá jen dvě ramena, a tak jde přeložit jen jedním způsobem."],
      [0, "Rovnoramenný trojúhelník jde přeložit podél spojnice vrcholu mezi rameny a středu základny, jednu osu tedy má."],
      [2, "Základna je jinak dlouhá než ramena, a proto přehyb jiným vrcholem nefunguje. Osa je jen jedna."],
    ],
  },
  {
    nazev: "kosodélník", kratce: "kosodélník", os: 0,
    prehyby: "žádný, ani podél úhlopříček, ani středem stran",
    zkousej: ZKOUSEJ_CTYRUHELNIK,
    bezOs: `Kosodélník nejde přeložit napůl tak, aby obě části na sebe padly, proto nemá žádnou osu souměrnosti (${osy(0)}). Je ale středově souměrný: po otočení o půl otáčky kolem průsečíku úhlopříček zapadne sám do sebe.`,
    chyby: [
      [2, "Úhlopříčky kosodélníku osami nejsou: po přeložení podél nich poloviny na sebe nepadnou. Kosodélník je jen středově souměrný."],
      [1, "Kosodélník nejde přeložit napůl tak, aby obě poloviny na sebe padly, protože šikmé strany se vždy rozejdou."],
      [4, "Čtyři osy má čtverec. Kosodélník má šikmé rohy a různě dlouhé sousední strany."],
    ],
  },
  {
    nazev: "kosočtverec, který není čtverec", kratce: "kosočtverec", os: 2,
    prehyby: "přehyby podél obou úhlopříček; přehyby středem stran nefungují",
    zkousej: ZKOUSEJ_CTYRUHELNIK,
    chyby: [
      [4, "Čtyři osy má jen čtverec. Kosočtverec jde přeložit jen podél úhlopříček, spojnice středů stran osami nejsou."],
      [1, "Osou je každá z obou úhlopříček kosočtverce, ne jen jedna."],
      [0, "Kosočtverec jde přeložit podél každé úhlopříčky tak, že poloviny na sebe padnou, osy tedy má."],
    ],
  },
  {
    nazev: "pravidelný šestiúhelník", kratce: "pravidelný šestiúhelník", os: 6,
    prehyby: "tři přehyby spojnicemi protějších vrcholů a tři přehyby spojnicemi středů protějších stran",
    zkousej: "podél spojnic protějších vrcholů i podél spojnic středů protějších stran",
    chyby: [
      [3, "Tady se počítají jen spojnice protějších vrcholů. Osami jsou i tři spojnice středů protějších stran, dohromady jich je šest."],
      [4, "Čtyři osy má čtverec. Pravidelný šestiúhelník má šest stejných stran, a proto jde přeložit víc způsoby."],
      [12, "Každá osa prochází dvěma protějšími vrcholy nebo středy dvou protějších stran. Když se počítá u každého vrcholu a u každé strany zvlášť, započítá se každá osa dvakrát."],
    ],
  },
  {
    nazev: "velké tiskací písmeno H", kratce: "písmeno H", os: 2,
    prehyby: "svislý přehyb uprostřed mezi svislými čarami a vodorovný přehyb přes příčku",
    zkousej: ZKOUSEJ_PISMENO,
    chyby: [
      [1, "Písmeno H jde přeložit napůl svisle i vodorovně, nejen jedním způsobem."],
      [4, "Čtyři osy má čtverec. Přehyb podél úhlopříčky u písmene H nefunguje: svislé čáry by po přeložení ležely vodorovně."],
      [0, "Písmeno H jde přeložit napůl svisle tak, že obě poloviny na sebe padnou, osy tedy má."],
    ],
  },
  {
    nazev: "velké tiskací písmeno T", kratce: "písmeno T", os: 1,
    prehyby: "jen svislý přehyb uprostřed",
    zkousej: ZKOUSEJ_PISMENO,
    chyby: [
      [2, "Vodorovně přeložit T nejde: vodorovná čára nahoře by po přeložení skončila dole. Funguje jen svislý přehyb."],
      [0, "Písmeno T jde přeložit podél svislé čáry uprostřed, jednu osu tedy má."],
      [4, "Čtyři osy má čtverec. U písmene T funguje jen svislý přehyb."],
    ],
  },
  {
    nazev: "velké tiskací písmeno A", kratce: "písmeno A", os: 1,
    prehyby: "jen svislý přehyb přes špičku",
    zkousej: ZKOUSEJ_PISMENO,
    chyby: [
      [2, "Vodorovně přeložit A nejde: špička nahoře by po přeložení skončila dole. Funguje jen svislý přehyb."],
      [0, "Písmeno A jde přeložit svisle přes špičku, jednu osu tedy má."],
      [3, "Tři osy má rovnostranný trojúhelník. Písmeno A jde přeložit jen svisle přes špičku."],
    ],
  },
  {
    nazev: "velké tiskací písmeno Z", kratce: "písmeno Z", os: 0,
    prehyby: "žádný, ani svislý, ani vodorovný",
    zkousej: ZKOUSEJ_PISMENO,
    bezOs: `Písmeno Z nejde přeložit napůl tak, aby obě části na sebe padly: šikmá čára by po přeložení vedla opačným směrem. Proto nemá žádnou osu souměrnosti (${osy(0)}). Je ale středově souměrné: vzhůru nohama vypadá stejně.`,
    chyby: [
      [1, "Po svislém přehybu by šikmá čára písmene Z vedla opačným směrem, takže přehyb nefunguje. Z je jen středově souměrné."],
      [2, "Ani svislý, ani vodorovný přehyb u Z nefunguje, protože šikmá čára by po přeložení vedla opačným směrem. Z je jen středově souměrné."],
      [4, "Čtyři osy má čtverec. Písmeno Z nejde přeložit napůl žádným způsobem, je jen středově souměrné."],
    ],
  },
  {
    nazev: "velké tiskací písmeno N", kratce: "písmeno N", os: 0,
    prehyby: "žádný, ani svislý, ani vodorovný",
    zkousej: ZKOUSEJ_PISMENO,
    bezOs: `Písmeno N nejde přeložit napůl tak, aby obě části na sebe padly: šikmá čára by po přeložení vedla opačným směrem. Proto nemá žádnou osu souměrnosti (${osy(0)}). Je ale středově souměrné: vzhůru nohama vypadá stejně.`,
    chyby: [
      [1, "Po svislém přehybu by šikmá čára písmene N vedla opačným směrem, takže přehyb nefunguje. N je jen středově souměrné."],
      [2, "Ani svislý, ani vodorovný přehyb u N nefunguje, protože šikmá čára by po přeložení vedla opačným směrem. N je jen středově souměrné."],
      [4, "Čtyři osy má čtverec. Písmeno N nejde přeložit napůl žádným způsobem, je jen středově souměrné."],
    ],
  },
];

function genL1Osy(u: Utvar): PracticeTask | null {
  return buildChoiceTask(
    `Kolik os souměrnosti má ${u.nazev}?`,
    osy(u.os),
    u.chyby.map(([n, why]) => ({ value: osy(n), why })),
    {
      hints: [
        `Představ si, že ${u.kratce} vystřihneš z papíru a zkoušíš ho přeložit napůl.`,
        `${velke(u.kratce)} zkoušej přehnout ${u.zkousej}. Počítej jen přehyby, po kterých obě části na sebe přesně padnou.`,
      ],
      solutionSteps: [
        "Osa souměrnosti je přímka, podél které jde útvar přeložit tak, aby obě části na sebe přesně padly.",
        `Přehyby, které fungují: ${u.prehyby}.`,
        `Počet os: ${cis(u.os)}.`,
      ],
      explanation: u.os === 0 && u.bezOs
        ? u.bezOs
        : `Osa souměrnosti je přímka, podél které jde útvar přeložit tak, aby obě části na sebe přesně padly. Fungují tyto přehyby: ${u.prehyby}. Počet os souměrnosti je tedy ${cis(u.os)}.`,
    },
  );
}

const JEN_OSOVA = ["A", "M", "T", "U", "V"];
const JEN_STREDOVA = ["N", "S", "Z"];
const NESOUMERNA = ["F", "G", "J", "L", "P", "R"];

const OTAZKY_STRED = [
  "Které z těchto velkých tiskacích písmen je středově souměrné?",
  "Které písmeno bude vypadat stejně, když kartičku s ním otočíš o půl otáčky (vzhůru nohama)?",
  "Které velké tiskací písmeno má střed souměrnosti?",
];
const OTAZKY_OSA = [
  "Které z těchto velkých tiskacích písmen je osově souměrné?",
  "Které písmeno jde přeložit napůl tak, aby obě poloviny na sebe přesně padly?",
  "Které velké tiskací písmeno má osu souměrnosti?",
];

function genL1PismenoStred(otazka: string): PracticeTask | null {
  const key = pick(JEN_STREDOVA);
  const pocetOsovych = pick([2, 3]);
  const dis = [
    ...shuffle(JEN_OSOVA).slice(0, pocetOsovych),
    ...shuffle(NESOUMERNA).slice(0, 3 - pocetOsovych),
  ];
  return buildChoiceTask(
    otazka,
    key,
    dis.map((p) => ({
      value: p,
      why: JEN_OSOVA.includes(p)
        ? `Písmeno ${p} má svislou osu souměrnosti, ale po otočení o půl otáčky stojí vzhůru nohama. Středově souměrné tedy není.`
        : `Písmeno ${p} po otočení o půl otáčky vypadá jinak a nejde ani přeložit napůl. Není souměrné vůbec.`,
    })),
    {
      hints: [
        otazka.includes("kartičku")
          ? "Středově souměrné písmeno vypadá po otočení kartičky vzhůru nohama úplně stejně."
          : "Středově souměrné písmeno vypadá stejně i po otočení o půl otáčky kolem svého středu.",
        "Představ si každé písmeno na kartičce a kartičku v duchu otoč vzhůru nohama. Vyhovuje jen písmeno, které pak vypadá úplně stejně; to, jestli jde písmeno přeložit napůl, tady nerozhoduje.",
      ],
      solutionSteps: [
        "Každé písmeno v duchu otoč o půl otáčky kolem jeho středu.",
        `Písmeno ${key} vypadá po otočení stejně, ostatní ne.`,
      ],
      explanation: `Středově souměrný útvar po otočení o půl otáčky kolem středu zapadne sám do sebe. Písmeno ${key} tak vypadá stejně i vzhůru nohama. Ostatní nabízená písmena po otočení vypadají jinak, i když některá z nich mají osu souměrnosti.`,
    },
  );
}

function genL1PismenoOsa(otazka: string): PracticeTask | null {
  const key = pick(JEN_OSOVA);
  const pocetStredovych = pick([1, 2]);
  const dis = [
    ...shuffle(JEN_STREDOVA).slice(0, pocetStredovych),
    ...shuffle(NESOUMERNA).slice(0, 3 - pocetStredovych),
  ];
  return buildChoiceTask(
    otazka,
    key,
    dis.map((p) => ({
      value: p,
      why: JEN_STREDOVA.includes(p)
        ? `Písmeno ${p} vypadá stejně po otočení o půl otáčky, je tedy středově souměrné. Přeložit napůl tak, aby poloviny na sebe padly, ale nejde.`
        : `Písmeno ${p} nejde přeložit napůl tak, aby obě poloviny na sebe přesně padly. Osu souměrnosti nemá.`,
    })),
    {
      hints: [
        otazka.includes("přeložit")
          ? "Hledej písmeno, které má levou a pravou polovinu jako obraz v zrcadle."
          : "Osově souměrné písmeno jde přeložit napůl tak, aby obě poloviny na sebe přesně padly.",
        "Každé písmeno zkus v duchu přeložit svisle i vodorovně. Vyhovuje jen písmeno, u kterého po přehybu poloviny na sebe padnou; otočení vzhůru nohama tady nerozhoduje.",
      ],
      solutionSteps: [
        "Každé písmeno v duchu přelož svisle a vodorovně.",
        `Písmeno ${key} jde přeložit podél svislé čáry uprostřed, ostatní ne.`,
      ],
      explanation: `Osově souměrný útvar jde přeložit podél osy tak, že obě poloviny na sebe přesně padnou. Písmeno ${key} má svislou osu uprostřed. Ostatní nabízená písmena takovou osu nemají; některá z nich jsou jen středově souměrná nebo nejsou souměrná vůbec.`,
    },
  );
}

/** Fakta o útvaru; hodí se jako zpětná vazba ve všech třech otázkách níže. */
const FAKT_UTVAR: Record<string, string> = {
  "rovnoramenný trojúhelník": "Rovnoramenný trojúhelník má jednu osu souměrnosti, ale středově souměrný není: po otočení o půl otáčky stojí vrcholem dolů.",
  "rovnostranný trojúhelník": "Rovnostranný trojúhelník má tři osy souměrnosti, ale středově souměrný není: po otočení o půl otáčky stojí vrcholem dolů.",
  "obdélník": "Obdélník má dvě osy souměrnosti (jde přeložit napůl svisle i vodorovně) a je i středově souměrný.",
  "kosočtverec": "Kosočtverec má dvě osy souměrnosti (jde přeložit podél obou úhlopříček) a je i středově souměrný.",
  "čtverec": "Čtverec má čtyři osy souměrnosti a je i středově souměrný.",
  "pravidelný šestiúhelník": "Pravidelný šestiúhelník má šest os souměrnosti a je i středově souměrný: protější strany jsou shodné a rovnoběžné.",
  "kosodélník": "Kosodélník je středově souměrný, ale osu souměrnosti nemá: nejde přeložit napůl tak, aby obě části na sebe padly.",
};

const HINT_DVE_VECI = "U každého útvaru rozhodni dvě věci: jde přeložit napůl a vypadá stejně po otočení o půl otáčky?";

/** Klíč kosodélník: středově souměrný bez osy. */
const OTAZKY_BEZ_OSY: { q: string; pool: string[] }[] = [
  {
    q: "Který útvar je středově souměrný, ale nemá žádnou osu souměrnosti?",
    pool: ["rovnoramenný trojúhelník", "rovnostranný trojúhelník", "obdélník", "kosočtverec", "čtverec"],
  },
  {
    q: "Který čtyřúhelník je středově souměrný, ale nemá žádnou osu souměrnosti?",
    pool: ["obdélník", "kosočtverec", "čtverec"],
  },
  {
    q: "Který útvar vypadá po otočení o půl otáčky stejně, ale nejde přeložit napůl tak, aby obě části na sebe padly?",
    pool: ["rovnoramenný trojúhelník", "rovnostranný trojúhelník", "obdélník", "kosočtverec", "čtverec"],
  },
];

function genL1BezOsy(o: { q: string; pool: string[] }): PracticeTask | null {
  const dis = shuffle(o.pool).slice(0, 3);
  return buildChoiceTask(
    o.q,
    "kosodélník",
    dis.map((u) => ({ value: u, why: FAKT_UTVAR[u] })),
    {
      hints: [
        o.q.includes("čtyřúhelník")
          ? "U každého čtyřúhelníku rozhodni dvě věci: jde přeložit napůl a vypadá stejně po otočení o půl otáčky?"
          : HINT_DVE_VECI,
        "Útvary, které jde přeložit napůl tak, aby části na sebe padly, vyřaď. Ze zbylých vyber ten, který po otočení o půl otáčky kolem svého středu zapadne sám do sebe.",
      ],
      solutionSteps: [
        `Osu souměrnosti mají: ${dis.join(", ")}.`,
        "Kosodélník osu nemá, ale po otočení o půl otáčky kolem průsečíku úhlopříček zapadne sám do sebe.",
      ],
      explanation: "Kosodélník nejde přeložit napůl tak, aby obě části na sebe padly, takže osu souměrnosti nemá. Jeho protější strany jsou ale shodné a rovnoběžné, a proto po otočení o půl otáčky kolem průsečíku úhlopříček zapadne sám do sebe: je středově souměrný.",
    },
  );
}

/** Klíč trojúhelník: osu má, středově souměrný není. */
function genL1JenOsa(): PracticeTask | null {
  const key = pick(["rovnoramenný trojúhelník", "rovnostranný trojúhelník"]);
  // Šestiúhelník vždy: jinak by dlouhý název klíče prozrazoval odpověď.
  const dis = ["pravidelný šestiúhelník", ...shuffle(["obdélník", "kosočtverec", "kosodélník", "čtverec"]).slice(0, 2)];
  return buildChoiceTask(
    "Který útvar má osu souměrnosti, ale není středově souměrný?",
    key,
    dis.map((u) => ({ value: u, why: FAKT_UTVAR[u] })),
    {
      hints: [
        HINT_DVE_VECI,
        "Každý útvar v duchu otoč o půl otáčky kolem jeho středu. Útvary, které pak zapadnou samy do sebe, vyřaď. Ze zbylých vyber ten, který jde přeložit napůl.",
      ],
      solutionSteps: [
        `Středově souměrné jsou: ${dis.join(", ")}.`,
        `${velke(key)} po otočení o půl otáčky stojí vrcholem dolů, ale přeložit napůl jde.`,
      ],
      explanation: `${FAKT_UTVAR[key]} Ostatní nabízené útvary mají protější strany shodné a rovnoběžné, a proto všechny po otočení o půl otáčky zapadnou samy do sebe.`,
    },
  );
}

/** Klíč čtyřúhelník s osou i středem. */
function genL1Oboji(): PracticeTask | null {
  const key = pick(["čtverec", "obdélník", "kosočtverec"]);
  const dis = ["kosodélník", "rovnoramenný trojúhelník", "rovnostranný trojúhelník"];
  return buildChoiceTask(
    "Který útvar je osově i středově souměrný?",
    key,
    dis.map((u) => ({ value: u, why: FAKT_UTVAR[u] })),
    {
      hints: [
        HINT_DVE_VECI,
        "Vyhovuje jen útvar, u kterého platí obojí: jde přeložit napůl tak, aby části na sebe padly, a zároveň po otočení o půl otáčky zapadne sám do sebe.",
      ],
      solutionSteps: [
        "Trojúhelníky mají osu, ale po otočení o půl otáčky stojí vrcholem dolů.",
        "Kosodélník je středově souměrný, ale osu nemá.",
        `Obojí splňuje jen ${key}.`,
      ],
      explanation: `${FAKT_UTVAR[key]} Trojúhelníky nejsou středově souměrné a kosodélník nemá osu, takže obojí splňuje jen ${key}.`,
    },
  );
}

function sablonyL1(): (() => PracticeTask | null)[] {
  const u = cyklus(UTVARY);
  const qs = cyklus(OTAZKY_STRED);
  const qo = cyklus(OTAZKY_OSA);
  const qb = cyklus(OTAZKY_BEZ_OSY);
  // Kosodélník je klíčem jen v jedné ze tří otázek o útvarech.
  const druh = cyklus<() => PracticeTask | null>([() => genL1BezOsy(qb()), genL1JenOsa, genL1Oboji]);
  return [
    () => genL1Osy(u()),
    () => genL1PismenoStred(qs()),
    () => genL1PismenoOsa(qo()),
    () => druh()(),
  ];
}

// ── L2: obraz bodu jedním krokem, vzdálenost bodu od obrazu ────────────────
interface KontextBod {
  uvod: (P: Bod) => string;
  otazka: string;
  /** Věta o středové souměrnosti s výslovným podmětem + otázka. */
  stred: (S: string) => string;
  jmeno: string; // podmět ve vysvětlení
  vysledek: (s: string) => string;
}

const HRACI = ["Tomáš", "Klára", "Vojta", "Ema", "Matyáš", "Bára"];
const ROSTLINY = ["levandule", "růže", "kopretina", "pivoňka"];

const KONTEXTY_BOD: (() => KontextBod)[] = [
  () => ({
    uvod: (P) => `Ve čtvercové síti leží bod A ${zap(P)}, tedy ${poloha(P)}.`,
    otazka: "Jaké souřadnice má jeho obraz A′?",
    stred: (S) => `Bod A se zobrazí ve středové souměrnosti se středem S ${S}. Jaké souřadnice má jeho obraz A′?`,
    jmeno: "Bod A",
    vysledek: (s) => `A′ ${s}`,
  }),
  () => ({
    uvod: (P) => `Trojúhelník KLM je nakreslený ve čtvercové síti. Jeho vrchol L leží v bodě ${zap(P)}, tedy ${poloha(P)}.`,
    otazka: "Jaké souřadnice má obraz L′ tohoto vrcholu?",
    stred: (S) => `Vrchol L se zobrazí ve středové souměrnosti se středem S ${S}. Jaké souřadnice má jeho obraz L′?`,
    jmeno: "Vrchol L",
    vysledek: (s) => `L′ ${s}`,
  }),
  () => {
    const j = pick(HRACI);
    return {
      uvod: (P) => `${j} hraje Lodě ve čtvercové síti a jednu loď má na políčku ${zap(P)}, tedy ${poloha(P)}.`,
      otazka: "Na kterém políčku bude druhá loď, která má stát souměrně s první?",
      stred: (S) => `Druhá loď má stát souměrně s první podle středu S ${S}. Na kterém políčku bude?`,
      jmeno: "První loď",
      vysledek: (s) => `druhá loď stojí na políčku ${s}`,
    };
  },
  () => {
    const r = pick(ROSTLINY);
    return {
      uvod: (P) => `Na plánku záhonu ve čtvercové síti roste ${r} v bodě ${zap(P)}, tedy ${poloha(P)}.`,
      otazka: `Kam se má zasadit druhá ${r}, aby obě rostly souměrně?`,
      stred: (S) => `Druhá ${r} má růst souměrně s první podle středu S ${S}. Kam se má zasadit?`,
      jmeno: `První ${r}`,
      vysledek: (s) => `druhá ${r} patří do bodu ${s}`,
    };
  },
];

const H_OSA: Record<Smer, [string, string]> = {
  svisla: [
    "Spočítej, o kolik políček je bod vlevo nebo vpravo od osy.",
    "Stejný počet políček odpočítej na druhou stranu osy, řádek nech beze změny. Obraz musí ležet za osou stejně daleko, jako byl bod před ní.",
  ],
  vodorovna: [
    "Spočítej, o kolik políček je bod pod osou nebo nad ní.",
    "Stejný počet políček odpočítej na druhou stranu osy, sloupec nech beze změny. Obraz musí ležet za osou stejně daleko, jako byl bod před ní.",
  ],
};

const H_STRED: [string, string] = [
  "Zjisti, o kolik políček se bod a střed liší vodorovně i svisle.",
  "O stejný počet políček pokračuj od středu dál, ve stejném směru, jakým se jde od bodu ke středu. Obraz leží na opačné straně středu než bod.",
];

function genL2Osa(ctx: KontextBod, smer: Smer): PracticeTask | null {
  const o: Osa = { smer, k: rnd(3, 9) };
  const i = idx(smer);
  const w = SLOVA[smer];
  const P: Bod = [rnd(1, 11), rnd(1, 11)];
  if (P[i] === o.k) return null;
  const O = podleOsy(P, o);
  if (!vSiti(O)) return null;
  const d = Math.abs(P[i] - o.k);
  const znam = P[i] < o.k ? 1 : -1; // o kolik dál při chybě „+1“

  const kand: (Kand | null)[] = [
    P[1 - i] !== o.k
      ? {
        b: podleOsy(P, { smer: jina(smer), k: o.k }),
        why: smer === "svisla"
          ? "Svislá osa rozděluje síť na levou a pravou část, a tak se mění jen to, jak daleko je bod vpravo. Tady se místo toho změnil řádek, jako by osa byla vodorovná."
          : "Vodorovná osa rozděluje síť na dolní a horní část, a tak se mění jen to, jak vysoko bod leží. Tady se místo toho změnil sloupec, jako by osa byla svislá.",
      }
      : null,
    ...shuffle<Kand>([
      {
        b: sHodnotou(P, i, o.k),
        why: "Bod skončil přímo na ose. Obraz ale musí být za osou stejně daleko, jako byl bod před ní.",
      },
      {
        b: sHodnotou(P, i, O[i] + znam),
        why: `Při počítání políček se započítal i ${w.nom}, ve kterém bod leží, a vzdálenost od osy tak vyšla o 1 větší. Správně je bod od osy vzdálený ${policek(d)}.`,
      },
      {
        b: sHodnotou(P, i, P[i] + o.k),
        why: `${velke(w.dat)} bodu se přičetlo číslo ${w.gen} osy. Obraz ale leží na opačné straně osy, stejně daleko od ní jako bod.`,
      },
    ]),
  ];

  return buildChoiceTask(
    `${ctx.uvod(P)} ${osaVeta(o)} ${ctx.otazka}`,
    zap(O),
    vyberBody(O, kand, [P], false),
    {
      hints: H_OSA[smer],
      solutionSteps: [
        `${ctx.jmeno} je ${w.ve} ${cis(P[i])}, osa ${w.ve} ${cis(o.k)}: vzdálenost od osy je ${cis(Math.max(P[i], o.k))} − ${cis(Math.min(P[i], o.k))} = ${cis(d)}.`,
        `Na druhé straně osy: ${krokOsa(P, o)}.`,
        `${velke(w.druhe)} se nemění (${cis(P[1 - i])}). Výsledek: ${ctx.vysledek(zap(O))}.`,
      ],
      explanation: `V osové souměrnosti leží obraz na opačné straně osy, stejně daleko od ní jako původní bod. ${velke(w.adj)} osa mění jen ${w.nom}: ${policek(d)} na jedné straně osy se změní na ${policek(d)} na druhé straně, ${w.druhe} zůstává. Proto ${ctx.vysledek(zap(O))}.`,
    },
  );
}

function genL2Stred(ctx: KontextBod): PracticeTask | null {
  const S: Bod = [rnd(3, 9), rnd(3, 9)];
  const P: Bod = [rnd(1, 11), rnd(1, 11)];
  if (P[0] === S[0] || P[1] === S[1]) return null;
  const O = podleStredu(P, S);
  if (!vSiti(O)) return null;

  const kand: (Kand | null)[] = [
    ...shuffle<Kand>([
      {
        b: [O[0], P[1]],
        why: "Tady se převrátil jen vodorovný směr, jako by šlo o svislou osu. Ve středové souměrnosti se obraz dostane na opačnou stranu od středu vodorovně i svisle.",
      },
      {
        b: [P[0], O[1]],
        why: "Tady se převrátil jen svislý směr, jako by šlo o vodorovnou osu. Ve středové souměrnosti se obraz dostane na opačnou stranu od středu vodorovně i svisle.",
      },
    ]),
    ...shuffle<Kand>([
      {
        b: [P[0] + S[0], P[1] + S[1]],
        why: "K souřadnicím bodu se přičetly souřadnice středu. Obraz ale musí ležet na opačné straně středu, stejně daleko jako bod.",
      },
      {
        b: [2 * P[0] - S[0], 2 * P[1] - S[1]],
        why: "Vzdálenost se odpočítala od bodu směrem pryč od středu. Obraz ale leží za středem, na opačné straně než bod.",
      },
    ]),
  ];

  return buildChoiceTask(
    `${ctx.uvod(P)} ${ctx.stred(zap(S))}`,
    zap(O),
    vyberBody(O, kand, [P, S], false),
    {
      hints: H_STRED,
      solutionSteps: [
        `${ctx.jmeno} leží od středu S: ${odStredu(P, S)}.`,
        `Obraz leží na opačné straně středu stejně daleko: ${odStredu(O, S)}.`,
        `Výpočet: ${krokStred(P, S)}. Výsledek: ${ctx.vysledek(zap(O))}.`,
      ],
      explanation: `Ve středové souměrnosti je střed S přesně v půlce mezi bodem a jeho obrazem. Obraz proto leží na opačné straně středu, stejně daleko vodorovně i svisle, a mění se obě souřadnice. Proto ${ctx.vysledek(zap(O))}.`,
    },
  );
}

interface KontextVzd {
  veta: (d: string) => string;
  od: string; // „od osy“
  u: string; // jednotka
  hodnoty: number[];
}

const JMENA_ZRCADLO: [string, string][] = [["Filip", "Filipa"], ["Ondra", "Ondry"], ["Kuba", "Kuby"], ["Adam", "Adama"]];
// 2,5 chybí záměrně: klíč „5 cm“ by byl podřetězcem zadání „2,5 cm“.
// 2 chybí záměrně: distraktor „d + 2“ by u d = 2 splynul s klíčem 2 · d.
const CM = [1.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5];
const M = [1, 1.5, 3, 3.5, 4, 4.5];

const KONTEXTY_VZD: (() => KontextVzd)[] = [
  () => ({
    veta: (d) => `Bod A leží ${d} od osy souměrnosti o. Jak daleko od sebe jsou bod A a jeho obraz A′ v osové souměrnosti?`,
    od: "od osy", u: "cm", hodnoty: CM,
  }),
  () => ({
    veta: (d) => `Bod B leží ${d} od středu souměrnosti S. Jak daleko od sebe jsou bod B a jeho obraz B′ ve středové souměrnosti se středem S?`,
    od: "od středu", u: "cm", hodnoty: CM,
  }),
  () => ({
    veta: (d) => `Vrchol K trojúhelníku KLM leží ${d} od osy souměrnosti. Jak daleko od sebe jsou vrchol K a jeho obraz K′?`,
    od: "od osy", u: "cm", hodnoty: CM,
  }),
  () => {
    const r = pick(ROSTLINY);
    return {
      veta: (d) => `Na záhonu roste ${r} ${d} od cestičky, která je osou souměrnosti záhonu. Druhá ${r} se zasadí souměrně na opačnou stranu cestičky. Jak daleko od sebe budou obě rostliny?`,
      od: "od cestičky", u: "m", hodnoty: M,
    };
  },
  () => {
    const [n, g] = pick(JMENA_ZRCADLO);
    return {
      veta: (d) => `${n} stojí ${d} před rovným zrcadlem. Zrcadlo se chová jako osa souměrnosti. Jak daleko od ${g} je jeho obraz?`,
      od: "od zrcadla", u: "m", hodnoty: M,
    };
  },
];

function genL2Vzdalenost(k: KontextVzd): PracticeTask | null {
  const d = pick(k.hodnoty);
  const f = (x: number) => `${cis(x)} ${k.u}`;
  return buildChoiceTask(
    k.veta(f(d)),
    f(2 * d),
    [
      {
        value: f(d),
        why: `To je vzdálenost ${k.od}. Obraz leží na druhé straně stejně daleko, takže bod a obraz jsou od sebe dvakrát dál.`,
      },
      {
        value: f(d / 2),
        why: `Vzdálenost se tu vydělila dvěma, jako by ${f(d)} byla vzdálenost bodu od obrazu. To je ale vzdálenost ${k.od}; obraz je stejně daleko na druhé straně.`,
      },
      Number.isInteger(d)
        ? {
          value: f(d + 2),
          why: `K ${cis(d)} se přičetlo 2 místo toho, aby se vzdálenost vzala dvakrát. Bod je ${k.od} ${f(d)} a obraz také ${f(d)}, dohromady tedy ${cis(d)} + ${cis(d)}.`,
        }
        : {
          // Typická chyba: zdvojnásobí se jen celá část, desetiny zůstanou.
          // (Dřív tu byl zápis „8,10“ — jediná možnost se dvěma desetinnými
          // místy, takže ji dítě vyřadilo podle tvaru, ne podle výpočtu.)
          value: f(2 * Math.floor(d) + (d - Math.floor(d))),
          why: `Zdvojnásobila se jen celá část (${cis(Math.floor(d))} + ${cis(Math.floor(d))} = ${cis(2 * Math.floor(d))}) a desetiny zůstaly jen jednou. Sečíst je ale potřeba celé číslo: ${cis(d)} + ${cis(d)} = ${f(2 * d)}.`,
        },
    ],
    {
      hints: [
        "Rozmysli si, kde leží obraz: na které straně a jak daleko.",
        "Obraz leží na opačné straně stejně daleko jako původní bod. Vzdálenost bodu od obrazu se tedy skládá ze dvou stejně dlouhých úseků, které na sebe navazují.",
      ],
      solutionSteps: [
        `Původní bod je ${k.od} ${f(d)}.`,
        `Obraz je na opačné straně také ${f(d)} ${k.od}.`,
        `Vzdálenost bodu a obrazu: ${cis(d)} + ${cis(d)} = ${f(2 * d)}.`,
      ],
      explanation: `V souměrnosti leží obraz na opačné straně stejně daleko jako původní bod. Mezi bodem a obrazem jsou tedy dva stejné úseky po ${f(d)}, dohromady ${f(2 * d)}.`,
    },
  );
}

function sablonyL2(): (() => PracticeTask | null)[] {
  const cb = cyklus(KONTEXTY_BOD);
  const cv = cyklus(KONTEXTY_VZD);
  return [
    () => genL2Osa(cb()(), "svisla"),
    () => genL2Osa(cb()(), "vodorovna"),
    () => genL2Stred(cb()()),
    () => genL2Vzdalenost(cv()()),
  ];
}

// ── L3: inverze a dva kroky ────────────────────────────────────────────────
function genL3Stred(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const S: Bod = [rnd(2, 10), rnd(2, 10)];
  const P: Bod = [rnd(1, 11), rnd(1, 11)];
  if (P[0] === S[0] || P[1] === S[1]) return null;
  const P2 = podleStredu(P, S);
  if (!vSiti(P2)) return null;
  const dx = Math.abs(P2[0] - P[0]);
  const dy = Math.abs(P2[1] - P[1]);

  const kand: (Kand | null)[] = [
    {
      b: [dx, dy],
      why: "Rozdíl souřadnic říká, jak daleko jsou body od sebe, ne kde je bod uprostřed. Střed je v půlce té vzdálenosti.",
    },
    {
      b: [P[0] + P2[0], P[1] + P2[1]],
      why: "Souřadnice obou bodů se sečetly, ale už se nevydělily dvěma. Střed má souřadnice v půlce mezi body.",
    },
    {
      b: [dx / 2, dy / 2],
      why: `Polovina rozdílu říká jen to, o kolik políček je střed vzdálený od bodu ${X}. Od bodu ${X} je potřeba se o tolik ještě posunout směrem k bodu ${X}′.`,
    },
    S[0] !== S[1]
      ? {
        b: [S[1], S[0]],
        why: "Souřadnice jsou prohozené. První číslo udává, kolik políček vpravo bod leží, druhé, kolik políček nahoru.",
      }
      : null,
    {
      b: [2 * P2[0] - S[0], 2 * P2[1] - S[1]],
      why: `Polovina vzdálenosti se odpočítala od bodu ${X}′ směrem ven z úsečky, ne k bodu ${X}. Střed ale leží mezi oběma body.`,
    },
  ];

  return buildChoiceTask(
    `Bod ${X} ${zap(P)}, tedy ${poloha(P)}, se ve středové souměrnosti zobrazil na bod ${X}′ ${zap(P2)}. Kde leží střed souměrnosti S?`,
    zap(S),
    vyberBody(S, kand, [P, P2], true),
    {
      hints: [
        "Střed souměrnosti leží přesně uprostřed mezi bodem a jeho obrazem.",
        "Zjisti, o kolik políček se oba body liší vodorovně a o kolik svisle. Od prvního bodu se posuň o polovinu každého rozdílu směrem k druhému bodu.",
      ],
      solutionSteps: [
        `Střed S leží v půlce úsečky ${X}${X}′.`,
        `Sloupec: (${cis(P[0])} + ${cis(P2[0])}) : 2 = ${cis(S[0])}. Řádek: (${cis(P[1])} + ${cis(P2[1])}) : 2 = ${cis(S[1])}.`,
        `Kontrola: bod ${X} leží od S ${odStredu(P, S)}; bod ${X}′ leží od S ${odStredu(P2, S)}.`,
      ],
      explanation: `Ve středové souměrnosti je střed S přesně uprostřed mezi bodem a jeho obrazem. Jeho sloupec je proto v půlce mezi ${cis(P[0])} a ${cis(P2[0])} a jeho řádek v půlce mezi ${cis(P[1])} a ${cis(P2[1])}: S ${zap(S)}.`,
    },
  );
}

function genL3VzorStred(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const S: Bod = [rnd(3, 9), rnd(3, 9)];
  const C2: Bod = [rnd(1, 11), rnd(1, 11)];
  if (C2[0] === S[0] || C2[1] === S[1]) return null;
  const C = podleStredu(C2, S);
  if (!vSiti(C)) return null;

  const kand: (Kand | null)[] = [
    {
      b: [C2[0] - S[0], C2[1] - S[1]],
      why: `Tady se od obrazu odečetl střed. Vyšlo tak jen to, o kolik políček je ${X}′ od středu vzdálený, ne poloha bodu ${X}.`,
    },
    {
      b: [2 * C2[0] - S[0], 2 * C2[1] - S[1]],
      why: `Od obrazu se pokračovalo dál od středu. Bod ${X} ale leží na opačné straně středu než ${X}′.`,
    },
    {
      b: [C[0], C2[1]],
      why: `Tady se převrátil jen vodorovný směr, jako by šlo o svislou osu. Ve středové souměrnosti leží bod ${X} na opačné straně středu vodorovně i svisle.`,
    },
    {
      b: [C2[0], C[1]],
      why: `Tady se převrátil jen svislý směr, jako by šlo o vodorovnou osu. Ve středové souměrnosti leží bod ${X} na opačné straně středu vodorovně i svisle.`,
    },
    {
      b: [C2[0] + S[0], C2[1] + S[1]],
      why: `K souřadnicím obrazu se přičetly souřadnice středu. Bod ${X} ale leží na opačné straně středu, stejně daleko jako ${X}′.`,
    },
  ];

  return buildChoiceTask(
    `Ve středové souměrnosti se středem S ${zap(S)} se bod ${X} zobrazil na bod ${X}′ ${zap(C2)}, který leží ${poloha(C2)}. Jaké souřadnice má bod ${X}?`,
    zap(C),
    vyberBody(C, kand, [S, C2], true),
    {
      hints: [
        "Hledaný bod leží na opačné straně středu než obraz, stejně daleko od středu.",
        "Zjisti, o kolik políček se obraz liší od středu vodorovně i svisle. O stejný počet políček pokračuj od středu dál, na opačnou stranu, než leží obraz.",
      ],
      solutionSteps: [
        `${X}′ leží od středu S: ${odStredu(C2, S)}.`,
        `Bod ${X} leží na opačné straně středu stejně daleko: ${krokStred(C2, S)}.`,
        `Kontrola: (${cis(C[0])} + ${cis(C2[0])}) : 2 = ${cis(S[0])} a (${cis(C[1])} + ${cis(C2[1])}) : 2 = ${cis(S[1])}.`,
      ],
      explanation: `Střed souměrnosti je v půlce mezi bodem ${X} a jeho obrazem ${X}′. Bod ${X} proto leží na opačné straně středu než ${X}′, stejně daleko vodorovně i svisle: ${X} ${zap(C)}.`,
    },
  );
}

function genL3VzorOsa(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const smer: Smer = pick(["svisla", "vodorovna"]);
  const o: Osa = { smer, k: rnd(3, 9) };
  const i = idx(smer);
  const w = SLOVA[smer];
  const C2: Bod = [rnd(1, 11), rnd(1, 11)];
  if (C2[i] === o.k) return null;
  const C = podleOsy(C2, o);
  if (!vSiti(C)) return null;
  const d = Math.abs(C2[i] - o.k);
  const znam = C2[i] < o.k ? 1 : -1;

  const kand: (Kand | null)[] = [
    C2[1 - i] !== o.k
      ? {
        b: podleOsy(C2, { smer: jina(smer), k: o.k }),
        why: `${velke(w.adj)} osa mění jen ${w.nom}, ${w.druhe} zůstává stejný. Tady se změnil ${w.druhe}, jako by osa byla ${SLOVA[jina(smer)].adj}.`,
      }
      : null,
    C2[i] - o.k >= 0
      ? {
        b: sHodnotou(C2, i, C2[i] - o.k),
        why: `Tady se od ${w.gen} obrazu odečetlo číslo ${w.gen} osy. Vyšlo jen to, o kolik políček je ${X}′ od osy, ne poloha bodu ${X}.`,
      }
      : null,
    {
      b: sHodnotou(C2, i, 2 * C2[i] - o.k),
      why: `Od obrazu se pokračovalo dál od osy. Bod ${X} ale leží na opačné straně osy než ${X}′.`,
    },
    {
      b: sHodnotou(C2, i, C[i] + znam),
      why: `Při počítání políček se započítal i ${w.nom} obrazu, a vzdálenost od osy tak vyšla o 1 větší. Správně je ${X}′ od osy ${policek(d)}.`,
    },
  ];

  return buildChoiceTask(
    `V osové souměrnosti se bod ${X} zobrazil na bod ${X}′ ${zap(C2)}, který leží ${poloha(C2)}. ${osaVeta(o)} Jaké souřadnice má bod ${X}?`,
    zap(C),
    vyberBody(C, kand, [C2], true),
    {
      hints: [
        "Hledaný bod leží na opačné straně osy než obraz, stejně daleko od osy.",
        smer === "svisla"
          ? "Spočítej, o kolik sloupců je obraz vzdálený od osy. Stejný počet sloupců odpočítej na druhou stranu osy, řádek nech beze změny."
          : "Spočítej, o kolik řádků je obraz vzdálený od osy. Stejný počet řádků odpočítej na druhou stranu osy, sloupec nech beze změny.",
      ],
      solutionSteps: [
        `${X}′ je ${w.ve} ${cis(C2[i])}, osa ${w.ve} ${cis(o.k)}: vzdálenost ${cis(Math.max(C2[i], o.k))} − ${cis(Math.min(C2[i], o.k))} = ${cis(d)}.`,
        `Na druhé straně osy: ${krokOsa(C2, o)}. ${velke(w.druhe)} se nemění (${cis(C2[1 - i])}).`,
        `Bod ${X} ${zap(C)}. Kontrola: (${cis(C[i])} + ${cis(C2[i])}) : 2 = ${cis(o.k)}, tedy osa je v půlce.`,
      ],
      explanation: `Osa souměrnosti prochází středem úsečky ${X}${X}′ a je na ni kolmá. Bod ${X} proto leží na opačné straně osy než ${X}′, stejně daleko (${policek(d)}), a ${w.druhe} se nemění: ${X} ${zap(C)}.`,
    },
  );
}

function genL3Osa(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const smer: Smer = pick(["svisla", "vodorovna"]);
  const i = idx(smer);
  const w = SLOVA[smer];
  const jw = SLOVA[jina(smer)];
  const k = rnd(2, 10);
  const D: Bod = [rnd(1, 11), rnd(1, 11)];
  if (D[i] === k) return null;
  const D2 = podleOsy(D, { smer, k });
  if (!vSiti(D2)) return null;
  const a = D[i];
  const b = D2[i];
  const rozdil = Math.abs(b - a);
  const c = D[1 - i];

  interface KandL { s: Smer; n: number; why: string }
  const vlastni: KandL[] = [
    {
      s: smer, n: rozdil,
      why: `Rozdíl ${cis(Math.max(a, b))} − ${cis(Math.min(a, b))} = ${cis(rozdil)} říká, jak daleko jsou body od sebe. Osa leží v půlce mezi nimi.`,
    },
    {
      s: smer, n: a + b,
      why: "Čísla se sečetla, ale už se nevydělila dvěma. Osa leží v půlce mezi body.",
    },
    {
      s: smer, n: rozdil / 2,
      why: `Polovina rozdílu říká jen to, jak daleko je osa od bodu ${X}. O tolik políček je potřeba se od bodu ${X} ještě posunout směrem k bodu ${X}′.`,
    },
  ];
  const jiny: KandL = pick([
    {
      s: jina(smer), n: c,
      why: `Oba body leží ${jw.ve} ${cis(c)}, takže jejich spojnice vede ${smer === "svisla" ? "vodorovně" : "svisle"}. Osa je na tuto spojnici kolmá, a proto je ${w.adj}.`,
    },
    {
      s: jina(smer), n: k,
      why: `Oba body mají stejný ${jw.nom}, mění se jen ${w.nom}. Osa je proto ${w.adj} a prochází ${w.ins}, ne ${jw.ins}.`,
    },
  ]);
  const kand = shuffle([...vlastni, jiny]).filter(
    (x, j, arr) => Number.isInteger(x.n) && x.n >= 0 && x.n <= MAX && !(x.s === smer && x.n === k)
      && arr.findIndex((y) => y.s === x.s && y.n === x.n) === j,
  );
  const vetsi = kand.find((x) => x.n > k);
  const mensi = kand.find((x) => x.n < k);
  const prvni = [vetsi, mensi].filter((x): x is KandL => !!x);
  const poradi = [...prvni, ...kand.filter((x) => !prvni.includes(x))];

  return buildChoiceTask(
    `Bod ${X} ${zap(D)}, tedy ${poloha(D)}, se v osové souměrnosti zobrazil na bod ${X}′ ${zap(D2)}. Kterým sloupcem nebo řádkem prochází osa souměrnosti?`,
    linie(smer, k),
    poradi.map((x) => ({ value: linie(x.s, x.n), why: x.why })),
    {
      hints: [
        "Osa je kolmá na spojnici bodu a jeho obrazu a prochází jejím středem.",
        "Podívej se, která souřadnice je u obou bodů stejná: podle ní poznáš, jestli je osa svislá, nebo vodorovná. Pak najdi číslo, které leží přesně v půlce mezi odlišnými souřadnicemi.",
      ],
      solutionSteps: [
        `Oba body mají stejný ${jw.nom} (${cis(c)}), mění se jen ${w.nom}: osa je proto ${w.adj}.`,
        `Osa leží v půlce: (${cis(a)} + ${cis(b)}) : 2 = ${cis(k)}.`,
        `Kontrola: bod ${X} je od osy ${policek(Math.abs(a - k))} a bod ${X}′ také ${policek(Math.abs(b - k))}.`,
      ],
      explanation: `Osa souměrnosti je kolmá na spojnici bodu a obrazu a prochází jejím středem. Body mají stejný ${jw.nom}, takže spojnice je ${smer === "svisla" ? "vodorovná" : "svislá"} a osa ${w.adj}. Její poloha je v půlce mezi ${cis(Math.min(a, b))} a ${cis(Math.max(a, b))}, tedy ${linie(smer, k)}.`,
    },
  );
}

function genL3OsaStred(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const smer: Smer = pick(["svisla", "vodorovna"]);
  const o: Osa = { smer, k: rnd(3, 9) };
  const i = idx(smer);
  const w = SLOVA[smer];
  const S: Bod = [rnd(3, 9), rnd(3, 9)];
  const E: Bod = [rnd(1, 11), rnd(1, 11)];
  if (E[i] === o.k) return null;
  const E1 = podleOsy(E, o);
  if (!vSiti(E1) || shoda(E1, S)) return null;
  const E2 = podleStredu(E1, S);
  if (!vSiti(E2) || shoda(E2, E) || shoda(E2, S)) return null;
  // Mezivýsledek při záměně osy; ve zpětné vazbě se ukazuje, proto musí být v síti.
  const Ej = podleOsy(E, { smer: jina(smer), k: o.k });
  const EjS = podleStredu(Ej, S);

  const kand: (Kand | null)[] = [
    { b: E1, why: "To je obraz jen po prvním kroku. Vzniklý bod je potřeba ještě zobrazit podle středu S." },
    { b: podleStredu(E, S), why: `Tady se vynechal první krok a bod ${X} se zobrazil rovnou podle středu S.` },
    {
      b: podleOsy(podleStredu(E, S), o),
      why: "Zobrazení proběhla v opačném pořadí: nejdřív podle středu, potom podle osy. Tady na pořadí záleží a výsledek vyšel jinde.",
    },
    E[1 - i] !== o.k && vSiti(Ej)
      ? {
        b: EjS,
        why: `V prvním kroku se u ${w.adjGen} osy změnil ${w.druhe} místo ${w.gen}, jako by osa byla ${SLOVA[jina(smer)].adj}, a vznikl bod ${zap(Ej)}. Jeho obraz podle středu S je ${zap(EjS)}.`,
      }
      : null,
  ];

  return buildChoiceTask(
    `Bod ${X} ${zap(E)}, tedy ${poloha(E)}, se nejdřív zobrazí v osové souměrnosti podle ${w.adjGen} osy, která prochází ${w.ins} ${cis(o.k)}. Vzniklý bod se pak zobrazí ve středové souměrnosti se středem S ${zap(S)}. Jaké souřadnice má výsledný bod?`,
    zap(E2),
    vyberBody(E2, kand, [E, S], true),
    {
      hints: [
        "Postupuj krok po kroku: nejdřív najdi obraz po prvním zobrazení a zapiš si ho.",
        `Teprve vzniklý bod zobraz podle středu. U ${w.adjGen} osy se mění jen ${w.nom}, u středu se mění obě souřadnice a bod se dostane na opačnou stranu středu.`,
      ],
      solutionSteps: [
        `1. krok (osa, ${linie(smer, o.k)}): ${w.nom} ${krokOsa(E, o)}, ${w.druhe} zůstává. Vznikne bod ${zap(E1)}.`,
        `2. krok (střed S ${zap(S)}): bod ${zap(E1)} leží od S ${odStredu(E1, S)}; ${krokStred(E1, S)}.`,
        `Výsledný bod: ${zap(E2)}.`,
      ],
      explanation: `Dvě zobrazení se dělají postupně: výsledek prvního je vstupem druhého. Podle osy se bod ${X} ${zap(E)} zobrazí na ${zap(E1)}, ten se podle středu S zobrazí na opačnou stranu středu, na ${zap(E2)}.`,
    },
  );
}

function genL3DveOsy(): PracticeTask | null {
  const X = pick(PISMENA_L3);
  const smer: Smer = pick(["svisla", "vodorovna"]);
  const i = idx(smer);
  const w = SLOVA[smer];
  const k1 = rnd(2, 10);
  const k2 = rnd(2, 10);
  if (k1 === k2) return null;
  const o1: Osa = { smer, k: k1 };
  const o2: Osa = { smer, k: k2 };
  const E: Bod = [rnd(1, 11), rnd(1, 11)];
  if (E[i] === k1) return null;
  const E1 = podleOsy(E, o1);
  if (!vSiti(E1) || E1[i] === k2) return null;
  const E2 = podleOsy(E1, o2);
  if (!vSiti(E2)) return null;
  const posun = k2 - k1;

  const kand: (Kand | null)[] = [
    { b: E1, why: "To je obraz jen po prvním kroku. Vzniklý bod je potřeba ještě zobrazit podle druhé osy." },
    { b: podleOsy(E, o2), why: `Tady se vynechala první osa a bod ${X} se zobrazil rovnou podle druhé osy.` },
    {
      b: podleOsy(podleOsy(E, o2), o1),
      why: "Zobrazení proběhla v opačném pořadí: nejdřív podle druhé osy, potom podle první. Výsledek se tak posunul na opačnou stranu.",
    },
    {
      b: sHodnotou(E, i, E[i] + posun),
      why: "Bod se posunul jen o vzdálenost mezi osami. Dvě osové souměrnosti s rovnoběžnými osami ho ale posunou o dvojnásobek této vzdálenosti.",
    },
  ];

  return buildChoiceTask(
    `Bod ${X} ${zap(E)}, tedy ${poloha(E)}, se nejdřív zobrazí v osové souměrnosti podle ${w.adjGen} osy, která prochází ${w.ins} ${cis(k1)}. Vzniklý bod se pak zobrazí podle ${w.adjGen} osy, která prochází ${w.ins} ${cis(k2)}. Jaké souřadnice má výsledný bod?`,
    zap(E2),
    vyberBody(E2, kand, [E], true),
    {
      hints: [
        "Postupuj krok po kroku: nejdřív najdi obraz podle první osy a zapiš si ho.",
        `Teprve vzniklý bod zobraz podle druhé osy. U ${w.adjGen} osy se pokaždé mění jen ${w.nom}, ${w.druhe} zůstává stejný.`,
      ],
      solutionSteps: [
        `1. krok (${linie(smer, k1)}): ${w.nom} ${krokOsa(E, o1)}. Vznikne bod ${zap(E1)}.`,
        `2. krok (${linie(smer, k2)}): ${w.nom} ${krokOsa(E1, o2)}. Vznikne bod ${zap(E2)}.`,
        `Kontrola: osy jsou od sebe ${policek(Math.abs(posun))}, bod se celkem posunul o dvojnásobek, o ${policek(Math.abs(2 * posun))}.`,
      ],
      explanation: `Zobrazení se dělají postupně: výsledek prvního je vstupem druhého. Podle první osy vznikne ${zap(E1)}, podle druhé ${zap(E2)}. Dvě osové souměrnosti s rovnoběžnými osami bod posunou o dvojnásobek vzdálenosti os, ${w.druhe} se nemění.`,
    },
  );
}

function sablonyL3(): (() => PracticeTask | null)[] {
  let vzor = Math.random() < 0.5;
  let dva = Math.random() < 0.5;
  return [
    genL3Stred,
    () => ((vzor = !vzor) ? genL3VzorStred() : genL3VzorOsa()),
    genL3Osa,
    () => ((dva = !dva) ? genL3OsaStred() : genL3DveOsy()),
  ];
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const sablony = level === 1 ? sablonyL1() : level === 2 ? sablonyL2() : sablonyL3();
  return ruzneUlohy(rotace(sablony));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const OSOVA_STREDOVA_SOUMERNOST: TopicMetadata[] = [
  {
    id: "g6-mat-osova-stredova-soumernost-6",
    rvpNodeId: "g6-matematika-geometrie-v-rovine-a-v-prostoru-osova-a-stredova-soumernost-osova-soumernost-rozsireni-stredova-soumernost",
    displayName: "Zrcadlení podle osy a podle středu",
    title: "Osová souměrnost - rozšíření, středová souměrnost",
    studentTitle: "Zrcadlení podle osy a podle středu",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Osová a středová souměrnost",
    briefDescription: "Najdi obraz bodu podle osy nebo středu a poznej souměrné útvary.",
    keywords: [
      "osová souměrnost", "středová souměrnost", "osa souměrnosti", "střed souměrnosti",
      "obraz bodu", "souměrné útvary", "čtvercová síť", "souřadnice",
    ],
    goals: [
      "Poznat osově a středově souměrné útvary a písmena a určit počet os souměrnosti.",
      "Najít obraz bodu v osové a ve středové souměrnosti ve čtvercové síti.",
      "Z bodu a jeho obrazu zpětně určit střed nebo osu a provést dvě souměrnosti za sebou.",
    ],
    boundaries: [
      "Jen 1. kvadrant: síť 0–12, souřadnice nejsou záporné (záporná čísla jsou učivo 7. ročníku).",
      "Poloha bodu je v zadání vždy popsaná slovy, úlohy jdou řešit bez obrázku.",
      "Osy jsou jen svislé a vodorovné; šikmé osy se nepoužívají.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-sit-krychle-a-kvadru-povrch-a-objem-6"],
    generator: gen,
    helpTemplate: {
      hint: "Obraz leží vždy na opačné straně osy nebo středu, stejně daleko jako původní bod.",
      steps: [
        "Zjisti, o kolik políček je bod vzdálený od osy nebo od středu.",
        "Stejný počet políček odpočítej na druhou stranu.",
        "U svislé osy se mění jen sloupec, u vodorovné jen řádek, u středu obě souřadnice.",
      ],
      commonMistake: "Záměna osové a středové souměrnosti, nebo posun bodu jen až na osu místo za ni.",
      example: "Svislá osa prochází sloupcem 6, bod A [3; 5]: vzdálenost 6 − 3 = 3, za osou 6 + 3 = 9, řádek zůstává, A′ [9; 5].",
    },
  },
];
