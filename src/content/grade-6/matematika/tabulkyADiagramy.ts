/**
 * Matematika 6. ročník — Práce s daty: tabulky a diagramy.
 *
 * Stavba podle výpočetního vzoru `fyzika/mereniDelky.ts`, helpery výhradně
 * z `./_shared`. Žák jen VYBÍRÁ (select_one): výsledky bývají desetinná čísla
 * a číselné pole by zahodilo čárku.
 *
 * Každá úloha nese tabulku přímo v zadání (bez obrázku), řádek po řádku:
 *   „Den: Po | Út | St“ a „Návštěvníci: 12 | 15 | 9“.
 * Kruhový diagram ani procenta sem nepatří (7. ročník).
 *
 *  • L1 — čtení a vyhledání (rozcvička z 5. ročníku): přečíst hodnotu,
 *    najít největší/nejmenší, spočítat sloupce nad prahem. Jen přirozená čísla.
 *  • L2 — počítání s daty: součet rozsahu „za … až …“, rozdíl „o kolik více“,
 *    součet celého řádku, třídění četností „A nebo B“ / „z obou skupin“.
 *  • L3 — analýza: aritmetický průměr, chybějící hodnota ze známého průměru,
 *    porovnání průměrů dvou skupin, rozdíl největší a nejmenší hodnoty.
 *
 * Hodnoty se drží v CELÝCH SETINÁCH (12,4 → 1240), takže součty i průměry se
 * počítají bez chyb plovoucí čárky. Každý distraktor je výsledek konkrétního
 * chybného čtení nebo postupu spočítaný z téže tabulky.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { cis, rnd, shuffle, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Sloupce tabulek ────────────────────────────────────────────────────────
/** Položka záhlaví: zápis v tabulce, 1. pád (možnost), tvar do věty, 4. pád („za … až …“). */
interface Sl {
  h: string;
  nom: string;
  lok: string;
  acc: string;
  m?: boolean;
}

const DNY: Sl[] = [
  { h: "Po", nom: "pondělí", lok: "v pondělí", acc: "pondělí" },
  { h: "Út", nom: "úterý", lok: "v úterý", acc: "úterý" },
  { h: "St", nom: "středa", lok: "ve středu", acc: "středu" },
  { h: "Čt", nom: "čtvrtek", lok: "ve čtvrtek", acc: "čtvrtek" },
  { h: "Pá", nom: "pátek", lok: "v pátek", acc: "pátek" },
  { h: "So", nom: "sobota", lok: "v sobotu", acc: "sobotu" },
  { h: "Ne", nom: "neděle", lok: "v neděli", acc: "neděli" },
];

const mesic = (nom: string, lok: string): Sl => ({ h: nom, nom, lok, acc: nom });
const MESICE: Sl[] = [
  mesic("leden", "v lednu"), mesic("únor", "v únoru"), mesic("březen", "v březnu"),
  mesic("duben", "v dubnu"), mesic("květen", "v květnu"), mesic("červen", "v červnu"),
  mesic("červenec", "v červenci"), mesic("srpen", "v srpnu"), mesic("září", "v září"),
  mesic("říjen", "v říjnu"), mesic("listopad", "v listopadu"), mesic("prosinec", "v prosinci"),
];
/** Školní rok: září až červen. */
const SKOLNI: Sl[] = [...MESICE.slice(8), ...MESICE.slice(0, 6)];

const cil = (nom: string, lok: string): Sl => ({ h: nom, nom, lok, acc: nom });
const CILE: Sl[] = [
  cil("zoo", "pro zoo"), cil("hrad", "pro hrad"), cil("aquapark", "pro aquapark"),
  cil("muzeum", "pro muzeum"), cil("skanzen", "pro skanzen"), cil("planetárium", "pro planetárium"),
  cil("rozhledna", "pro rozhlednu"), cil("jeskyně", "pro jeskyni"),
];

/**
 * Rostliny: `lok` je 2. pád („výška hrachu“). Jen rostliny, které na záhonu
 * běžně dorostou do 40–60 cm (řeřicha tak vysoká nebývá, proto tu není).
 */
const rostlina = (nom: string, gen: string): Sl => ({ h: nom, nom, lok: gen, acc: nom });
const ROSTLINY: Sl[] = [
  rostlina("hrách", "hrachu"), rostlina("fazole", "fazole"), rostlina("slunečnice", "slunečnice"),
  rostlina("kukuřice", "kukuřice"), rostlina("bob", "bobu"),
  rostlina("hořčice", "hořčice"), rostlina("pšenice", "pšenice"),
];

const odpoved = (nom: string): Sl => ({ h: nom, nom, lok: nom, acc: nom });
const DOPRAVA: Sl[] = ["pěšky", "autobusem", "na kole", "autem", "tramvají", "vlakem"].map(odpoved);
const SPORTY: Sl[] = ["fotbal", "florbal", "plavání", "tanec", "hokej", "volejbal"].map(odpoved);

const jmeno = (jm: string, m: boolean): Sl => ({ h: jm, nom: jm, lok: jm, acc: jm, m });
const JMENA: Sl[] = [
  jmeno("Adam", true), jmeno("Bára", false), jmeno("Cyril", true), jmeno("Dana", false),
  jmeno("Filip", true), jmeno("Gábina", false), jmeno("Hana", false), jmeno("Ivan", true),
  jmeno("Jana", false), jmeno("Karel", true), jmeno("Lenka", false), jmeno("Matěj", true),
  jmeno("Nela", false), jmeno("Ondra", true), jmeno("Petra", false), jmeno("Radek", true),
  jmeno("Šárka", false), jmeno("Tereza", false), jmeno("Vojta", true), jmeno("Zdeněk", true),
];

// ── Čísla v setinách ───────────────────────────────────────────────────────
/** Počet desetinných míst hodnoty v setinách (1240 → 1, 1245 → 2, 1200 → 0). */
const dp = (h: number): number => (h % 100 === 0 ? 0 : h % 10 === 0 ? 1 : 2);
/** Přesné dělení v setinách, nebo NaN (pak se kandidát zahodí). */
const delH = (a: number, b: number): number => (a % b === 0 ? a / b : NaN);
const soucet = (xs: number[]): number => xs.reduce((s, x) => s + x, 0);

/** Pevný zápis se `d` desetinnými místy, bez zkracování nul (630, 2 → „6,30“). */
function pevne(h: number, d: number): string {
  const cela = cis(Math.floor(h / 100));
  if (d === 0) return cela;
  return `${cela},${String(h % 100).padStart(2, "0").slice(0, d)}`;
}

/**
 * Chyba zarovnání: čísla s různým počtem desetinných míst zapsaná pod sebe
 * zarovnaná vpravo („2,5 + 1,25“ jako 25 + 125). Čárka se pak vezme podle
 * delšího čísla. `null`, když mají všechna čísla stejný počet míst.
 */
function zarovnaneVpravo(a: number[], op: "+" | "-"): number | null {
  const d = a.map(dp);
  const maxD = Math.max(...d);
  if (d.every((x) => x === d[0])) return null;
  const cifry = a.map((h, i) => h / 10 ** (2 - d[i]));
  const r = op === "+" ? soucet(cifry) : cifry[0] - cifry[1];
  return r * 10 ** (2 - maxD);
}

// ── Kontexty ───────────────────────────────────────────────────────────────
interface Zaklad {
  titulek: string;
  hlavicka: string;
  pool: Sl[];
  /** Sloupce jdou po sobě (dny, měsíce) → vybírá se souvislé okno. */
  poradi: boolean;
  radek: string;
  /** Jednotka za číslem v možnostech („°C“, „mm“); peníze řeší `penize`. */
  jed: string;
  penize?: boolean;
  /** Krok, min a max hodnot v setinách. */
  krok: number;
  min: number;
  max: number;
  /** „větší“ / „vyšší“ — slovo pro porovnání v nápovědě a zpětné vazbě. */
  vic?: string;
}

/** Číslo v buňce tabulky (peníze vždy na dvě desetinná místa). */
const bunka = (k: Zaklad, h: number): string => (k.penize ? pevne(h, 2) : cis(h / 100));
/** Hodnota s jednotkou, jak stojí v možnosti. */
const hodn = (k: Zaklad, h: number): string =>
  k.penize ? `${pevne(h, 2)} Kč` : k.jed ? `${cis(h / 100)} ${k.jed}` : cis(h / 100);
/** Mezivýsledek součtu: s koncovou nulou ukáže i zkrácený tvar (6,30 = 6,3). */
function mezisoucet(k: Zaklad, h: number, hodnoty: number[]): string {
  if (k.penize) return pevne(h, 2);
  const maxD = Math.max(...hodnoty.map(dp));
  return dp(h) < maxD ? `${pevne(h, maxD)} = ${cis(h / 100)}` : cis(h / 100);
}

function vyberSloupce(k: Zaklad, n: number): Sl[] {
  const m = Math.min(n, k.pool.length);
  if (!k.poradi) return shuffle(k.pool).slice(0, m);
  const start = rnd(0, k.pool.length - m);
  return k.pool.slice(start, start + m);
}

/** `n` navzájem různých hodnot z rozsahu kontextu. */
function hodnoty(k: Zaklad, n: number): number[] {
  const out = new Set<number>();
  while (out.size < n) out.add(rnd(Math.ceil(k.min / k.krok), Math.floor(k.max / k.krok)) * k.krok);
  return [...out];
}

interface Radek {
  label: string;
  vals: (number | null)[];
}

function tabulka(k: Zaklad, sloupce: Sl[], radky: Radek[]): string {
  const hlav = `${k.hlavicka}: ${sloupce.map((s) => s.h).join(" | ")}.`;
  const data = radky.map((r) => `${r.label}: ${r.vals.map((v) => (v === null ? "?" : bunka(k, v))).join(" | ")}.`);
  return [`Tabulka: ${k.titulek}.`, hlav, ...data].join("\n");
}

const vypis = (k: Zaklad, xs: number[]): string => xs.map((x) => bunka(k, x)).join("; ");
const plusy = (k: Zaklad, xs: number[]): string => xs.map((x) => bunka(k, x)).join(" + ");

const CARKA = "Zapiš čísla pod sebe tak, aby čárka byla pod čárkou.";

// ── Kontrola hotové úlohy ──────────────────────────────────────────────────
/** Číselné jádro možnosti = poslední číslo v ní („6.A o 1,2 kg“ → „1,2“). */
function jadro(s: string): string | null {
  const m = s.match(/\d{1,3}(?: \d{3})*(?:,\d+)?/g);
  return m ? m[m.length - 1] : null;
}

/** Obsahuje text číslo jako samostatné číslo (ne jako kus jiného čísla nebo „6.A“)? */
function obsahujeCislo(text: string, c: string): boolean {
  const esc = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\d,])${esc}(?!\\d|,\\d|\\.[A-Z])`).test(text);
}

interface Kand {
  h: number;
  why: string;
}

/**
 * Z kandidátů vybere platné distraktory: kladné, v celých setinách, různé od
 * klíče a (na L3) se stejným počtem desetinných míst jako klíč.
 */
function vyber(k: Zaklad, klic: number, kands: Kand[], stejnaMista: boolean): Kand[] {
  const seen = new Set<number>([klic]);
  const out: Kand[] = [];
  for (const c of kands) {
    if (!Number.isInteger(c.h) || c.h <= 0 || seen.has(c.h)) continue;
    if (stejnaMista && !k.penize && dp(c.h) !== dp(klic)) continue;
    seen.add(c.h);
    out.push(c);
  }
  return out;
}

const naDistraktory = (k: Zaklad, ks: Kand[]): Distractor[] => ks.map((c) => ({ value: hodn(k, c.h), why: c.why }));

const konci05 = (s: string): boolean => /[05]$/.test(jadro(s) ?? "");

/**
 * Úloha se čtyřmi možnostmi, nebo `null` (pak se táhne znovu), když
 * distraktory splynou, klíč stojí ve znění otázky nebo v nápovědě, obě
 * nápovědy jsou stejné, nebo (na L3) klíč jako jediný končí 0 či 5.
 */
function uloha(
  tab: string,
  otazka: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
  l3 = false,
): PracticeTask | null {
  const c = jadro(correct);
  if (c ? obsahujeCislo(otazka, c) : otazka.includes(correct)) return null;
  const t = buildChoiceTask(`${tab}\n${otazka}`, correct, distractors, parts);
  if (!t) return null;
  const opts = t.options ?? [];
  if (l3 && konci05(correct) && !opts.some((o) => o !== correct && konci05(o))) return null;
  // Výčet „Čísla ze zadání: …“ by u tabulky zopakoval celý řádek a čárka
  // v seznamu by se pletla s desetinnou. Nápovědy tu čísla nepotřebují.
  // Obecná rada „ověř zkouškou.“ z `dveNapovedy` žákovi neřekne, CO ověřit,
  // a u čtení nebo hledání krajní hodnoty žádná zkouška není. Šablony, které
  // zkoušku mají, ji píšou vlastními slovy („zkouškou: spočítej…“) a ty zůstanou.
  // U čtení (L1) nedává smysl ani obecné „porovnej s odhadem“.
  const cteni = /^(Přečti|Najdi)/.test(otazka);
  const hints = (t.hints ?? []).map((h) => {
    let x = h.replace(/ Čísla ze zadání: .*\.$/, "").replace(/ Nakonec si výsledek ověř zkouškou\./g, "");
    if (cteni) x = x.replace(/ Porovnej výsledek s odhadem: dává takové číslo smysl\?/g, "");
    return x;
  });
  t.hints = hints;
  if (hints.length < 2 || hints[0] === hints[1]) return null;
  if (hints.some((h) => h.includes(correct) || (c !== null && obsahujeCislo(h, c)))) return null;
  return t;
}

/** Střídá šablony dokola (rovnoměrně), každou zkusí vícekrát. */
function rotuj(sablony: (() => PracticeTask | null)[]): () => PracticeTask | null {
  let i = 0;
  return () => {
    const s = sablony[i++ % sablony.length];
    for (let pokus = 0; pokus < 80; pokus++) {
      const t = s();
      if (t) return t;
    }
    return null;
  };
}

const pickK = <T,>(xs: T[]): T => xs[rnd(0, xs.length - 1)];

// ── L1 — čtení a vyhledání ─────────────────────────────────────────────────
interface K1 extends Zaklad {
  nMin: number;
  nMax: number;
  hodnota: (s: Sl) => string;
  extrem: (max: boolean) => string;
  prah: (n: string) => string;
}

const K1_KONTEXTY: K1[] = [
  {
    titulek: "Počet návštěvníků školní knihovny v jednom týdnu", hlavicka: "Den", pool: DNY.slice(0, 5), poradi: true,
    radek: "Návštěvníci", jed: "", krok: 100, min: 800, max: 4500, nMin: 5, nMax: 5,
    hodnota: (s) => `kolik návštěvníků přišlo do knihovny ${s.lok}`,
    extrem: (max) => `který den přišlo do knihovny ${max ? "nejvíce" : "nejméně"} návštěvníků`,
    prah: (n) => `ve kolika dnech přišlo do knihovny více než ${n} návštěvníků`,
  },
  {
    titulek: "Hlasování žáků šestých tříd o cíli výletu", hlavicka: "Cíl", pool: CILE, poradi: false,
    radek: "Počet hlasů", jed: "", krok: 100, min: 500, max: 3200, nMin: 5, nMax: 6,
    hodnota: (s) => `kolik žáků hlasovalo ${s.lok}`,
    extrem: (max) => `který cíl výletu dostal ${max ? "nejvíce" : "nejméně"} hlasů`,
    prah: (n) => `u kolika cílů výletu byl počet hlasů větší než ${n}`,
  },
  {
    titulek: "Počet knih, které žáci přečetli za pololetí", hlavicka: "Žák", pool: JMENA, poradi: false,
    radek: "Počet knih", jed: "", krok: 100, min: 500, max: 2600, nMin: 5, nMax: 6,
    hodnota: (s) => `kolik knih přečetl${s.m ? "" : "a"} ${s.h}`,
    extrem: (max) => `kdo přečetl ${max ? "nejvíce" : "nejméně"} knih`,
    prah: (n) => `u kolika žáků byl počet přečtených knih větší než ${n}`,
  },
  {
    titulek: "Polední teploty v jednom týdnu", hlavicka: "Den", pool: DNY, poradi: true,
    radek: "Teplota (°C)", jed: "°C", krok: 100, min: 800, max: 3000, nMin: 5, nMax: 6, vic: "vyšší",
    hodnota: (s) => `jaká teplota byla naměřena ${s.lok}`,
    extrem: (max) => `který den byla naměřena ${max ? "nejvyšší" : "nejnižší"} teplota`,
    prah: (n) => `ve kolika dnech byla teplota vyšší než ${n}`,
  },
  {
    titulek: "Srážky naměřené v jednotlivých měsících", hlavicka: "Měsíc", pool: MESICE, poradi: true,
    radek: "Srážky (mm)", jed: "mm", krok: 100, min: 1200, max: 9500, nMin: 5, nMax: 6,
    hodnota: (s) => `kolik srážek spadlo ${s.lok}`,
    extrem: (max) => `ve kterém měsíci spadlo ${max ? "nejvíce" : "nejméně"} srážek`,
    prah: (n) => `ve kolika měsících spadlo více než ${n} srážek`,
  },
  {
    titulek: "Výška rostlin na záhonu", hlavicka: "Rostlina", pool: ROSTLINY, poradi: false,
    radek: "Výška (cm)", jed: "cm", krok: 100, min: 1000, max: 6000, nMin: 5, nMax: 6, vic: "vyšší",
    hodnota: (s) => `jaká byla výška ${s.lok}`,
    extrem: (max) => `která rostlina byla ${max ? "nejvyšší" : "nejnižší"}`,
    prah: (n) => `kolik rostlin bylo vyšších než ${n}`,
  },
];

function l1Data(): { k: K1; cols: Sl[]; vals: number[]; tab: string } {
  const k = pickK(K1_KONTEXTY);
  const cols = vyberSloupce(k, rnd(k.nMin, k.nMax));
  const vals = hodnoty(k, cols.length);
  return { k, cols, vals, tab: tabulka(k, cols, [{ label: k.radek, vals }]) };
}

function l1Hodnota(): PracticeTask | null {
  const { k, cols, vals, tab } = l1Data();
  const n = cols.length;
  const i = rnd(0, n - 1);
  const s = cols[i];
  const jine = shuffle([...Array(n).keys()].filter((j) => j !== i)).sort((a, b) => Math.abs(a - i) - Math.abs(b - i));
  const kands: Kand[] = jine.map((j) => ({
    h: vals[j],
    why: Math.abs(j - i) === 1
      ? `Tohle číslo patří k sousednímu sloupci „${cols[j].h}“. Najdi nejdřív v záhlaví sloupec „${s.h}“ a od něj jdi prstem dolů.`
      : `Tohle číslo patří ke sloupci „${cols[j].h}“, ne ke sloupci „${s.h}“. Veď prstem nejdřív po záhlaví, pak dolů.`,
  }));
  const klic = hodn(k, vals[i]);
  return uloha(tab, `Přečti z tabulky, ${k.hodnota(s)}.`, klic, naDistraktory(k, vyber(k, vals[i], kands, false)), {
    hints: [
      `Krok 1: V řádku „${k.hlavicka}“ najdi sloupec „${s.h}“.`,
      `Krok 2: Od sloupce „${s.h}“ sjeď prstem rovnou dolů do řádku „${k.radek}“ a přečti číslo, které tam stojí.`,
      `Krok 3: Zkontroluj, že čteš právě tento sloupec, ne sousední.`,
    ],
    solutionSteps: [
      `V záhlaví najdeme sloupec „${s.h}“.`,
      `Pod ním v řádku „${k.radek}“ stojí ${bunka(k, vals[i])}.`,
      `Odpověď: ${klic}.`,
    ],
    explanation: `Hodnotu najdeme na křížení sloupce a řádku: sloupec určuje záhlaví „${s.h}“, řádek je „${k.radek}“. Tam stojí ${klic}.`,
  });
}

function l1Extrem(): PracticeTask | null {
  const { k, cols, vals, tab } = l1Data();
  const n = cols.length;
  const max = Math.random() < 0.5;
  const poradi = [...Array(n).keys()].sort((a, b) => (max ? vals[b] - vals[a] : vals[a] - vals[b]));
  const iK = poradi[0];
  const V = max ? "největší" : "nejmenší";
  const O = max ? "nejmenší" : "největší";
  const cmp = max ? "větší" : "menší";
  const sousede = [iK - 1, iK + 1].filter((j) => j >= 0 && j < n);
  const soused = sousede[rnd(0, sousede.length - 1)];
  const distractors: Distractor[] = [
    {
      value: cols[poradi[1]].nom,
      why: `Tady je v řádku až druhé ${V} číslo. Porovnej všechna čísla, v jiném sloupci je číslo ještě ${cmp}.`,
    },
    {
      value: cols[poradi[n - 1]].nom,
      why: `Tady je v řádku naopak ${O} číslo, ale otázka hledá ${V}.`,
    },
    {
      value: cols[soused].nom,
      why: `Tohle je sloupec vedle toho správného. Od ${max ? "největšího" : "nejmenšího"} čísla jdi prstem rovnou nahoru do záhlaví.`,
    },
    {
      value: cols[poradi[2]].nom,
      why: `Tady ${V} číslo není, v řádku jsou ještě dvě čísla ${cmp}.`,
    },
  ];
  const klic = cols[iK].nom;
  return uloha(tab, `Najdi v tabulce, ${k.extrem(max)}.`, klic, distractors, {
    hints: [
      `Krok 1: Projdi v řádku „${k.radek}“ všech ${pad(n, "ČÍSLO")} od sloupce „${cols[0].h}“ po sloupec „${cols[n - 1].h}“ a hledej ${V} z nich.`,
      `Krok 2: Až ${V} číslo najdeš, jdi od něj prstem nahoru do řádku „${k.hlavicka}“ a přečti, ke kterému sloupci patří.`,
      `Krok 3: Zkontroluj, že žádné jiné číslo v řádku není ${cmp} než to, které jsi vybral.`,
    ],
    solutionSteps: [
      `Čísla v řádku „${k.radek}“: ${vypis(k, vals)}.`,
      `${max ? "Největší" : "Nejmenší"} z nich je ${hodn(k, vals[iK])}.`,
      `Patří ke sloupci „${cols[iK].h}“, odpověď je ${klic}.`,
    ],
    explanation: `Nejdřív porovnáme všechna čísla v řádku a najdeme ${V}: ${hodn(k, vals[iK])}. Teprve potom přečteme v záhlaví, ke kterému sloupci patří: ${klic}.`,
  });
}

function l1Prah(): PracticeTask | null {
  const { k, cols, vals, tab } = l1Data();
  const n = cols.length;
  const serazene = [...vals].sort((a, b) => a - b);
  const N = serazene[rnd(1, n - 2)];
  const vetsi = vals.filter((v) => v > N);
  const kl = vetsi.length;
  const Nt = hodn(k, N);
  const vic = k.vic ?? "větší";
  const kands: Kand[] = [
    { h: (kl + 1) * 100, why: `Započítal jsi i sloupec s hodnotou přesně ${Nt}. Ta ale není ${vic} než ${Nt}.` },
    { h: (n - kl - 1) * 100, why: `Spočítal jsi sloupce, kde je hodnota menší než ${Nt}. Otázka se ptá na hodnoty ${vic}.` },
    { h: (n - kl) * 100, why: `Spočítal jsi sloupce, kde hodnota ${vic} než ${Nt} není. Otázka se ptá přesně na opak.` },
    { h: (kl - 1) * 100, why: `Jeden sloupec s hodnotou ${vic} než ${Nt} jsi přehlédl. Projdi řádek od prvního čísla po poslední.` },
    { h: n * 100, why: `Spočítal jsi všechny sloupce tabulky. Počítají se jen ty, kde je hodnota ${vic} než ${Nt}.` },
  ];
  const bezJednotky: Zaklad = { ...k, jed: "" };
  const klic = cis(kl);
  return uloha(tab, `Najdi v tabulce, ${k.prah(Nt)}.`, klic, naDistraktory(bezJednotky, vyber(bezJednotky, kl * 100, kands, false)), {
    hints: [
      `Krok 1: Porovnej s hodnotou ${Nt} postupně všech ${pad(n, "ČÍSLO")} v řádku „${k.radek}“.`,
      `Krok 2: Počítej jen sloupce, kde je číslo ${vic} než ${Nt}. Sloupec, kde je přesně ${Nt}, se nepočítá, protože stejná hodnota není ${vic}.`,
      `Krok 3: Zkontroluj, že jsi prošel všechny sloupce od prvního po poslední a žádný nevynechal.`,
    ],
    solutionSteps: [
      `Čísla v řádku „${k.radek}“: ${vypis(k, vals)}.`,
      `${vic === "vyšší" ? "Vyšší" : "Větší"} než ${Nt} jsou: ${vypis(k, vetsi)}.`,
      `Počet takových sloupců: ${klic}.`,
    ],
    explanation: `Počítáme jen sloupce, kde je hodnota ${vic} než ${Nt}. Sloupec s hodnotou přesně ${Nt} mezi ně nepatří. Počet takových sloupců: ${klic}.`,
  });
}

// ── Společné kontexty L2 a L3 ──────────────────────────────────────────────
const TRZBY: Zaklad = {
  titulek: "Tržby stánku s limonádou v jednom týdnu", hlavicka: "Den", pool: DNY, poradi: true,
  radek: "Tržba (Kč)", jed: "Kč", penize: true, krok: 10, min: 35000, max: 160000,
};
const SRAZKY: Zaklad = {
  titulek: "Srážky naměřené v jednotlivých měsících", hlavicka: "Měsíc", pool: MESICE, poradi: true,
  radek: "Srážky (mm)", jed: "mm", krok: 10, min: 800, max: 9500,
};
const KNIHOVNA: Zaklad = {
  titulek: "Počet návštěvníků školní knihovny", hlavicka: "Den", pool: DNY.slice(0, 5), poradi: true,
  radek: "Návštěvníci", jed: "", krok: 100, min: 800, max: 4500,
};
const PAPIR: Zaklad = {
  titulek: "Sběr papíru ve škole po měsících", hlavicka: "Měsíc", pool: SKOLNI, poradi: true,
  radek: "Papír (kg)", jed: "kg", krok: 10, min: 1200, max: 8500,
};
const TEPLOTY: Zaklad = {
  titulek: "Polední teploty v jednom týdnu", hlavicka: "Den", pool: DNY, poradi: true,
  radek: "Teplota (°C)", jed: "°C", krok: 10, min: 600, max: 2800, vic: "vyšší",
};
const SKOK: Zaklad = {
  titulek: "Nejlepší skoky do dálky na školních závodech", hlavicka: "Žák", pool: JMENA, poradi: false,
  radek: "Skok (m)", jed: "m", krok: 1, min: 240, max: 480,
};
const ROSTLINY_K: Zaklad = {
  titulek: "Výška rostlin na záhonu", hlavicka: "Rostlina", pool: ROSTLINY, poradi: false,
  radek: "Výška (cm)", jed: "cm", krok: 10, min: 1000, max: 6000, vic: "vyšší",
};
const KNIHY: Zaklad = {
  titulek: "Počet knih, které žáci přečetli za pololetí", hlavicka: "Žák", pool: JMENA, poradi: false,
  radek: "Počet knih", jed: "", krok: 100, min: 300, max: 2600,
};

/** Jeden řádek dat; u desetinných kontextů musí tabulka obsahovat desetinnou čárku. */
function jedenRadek(k: Zaklad, n: number): { cols: Sl[]; vals: number[]; tab: string } | null {
  const cols = vyberSloupce(k, n);
  const vals = hodnoty(k, cols.length);
  const tab = tabulka(k, cols, [{ label: k.radek, vals }]);
  if (k.krok < 100 && !k.penize && !vals.some((v) => v % 100 !== 0)) return null;
  return { cols, vals, tab };
}

const maCarku = (tab: string): boolean => tab.split("\n").slice(1).some((r) => r.includes(","));

// ── L2 — počítání s daty ───────────────────────────────────────────────────
interface K2Rozsah extends Zaklad {
  rozsah: (a: string, b: string) => string;
}
const K2_ROZSAH: K2Rozsah[] = [
  { ...TRZBY, rozsah: (a, b) => `kolik korun stánek utržil celkem za ${a} až ${b}` },
  { ...SRAZKY, rozsah: (a, b) => `kolik srážek spadlo celkem za ${a} až ${b}` },
  { ...KNIHOVNA, rozsah: (a, b) => `kolik návštěvníků přišlo do knihovny celkem za ${a} až ${b}` },
  { ...PAPIR, rozsah: (a, b) => `kolik papíru škola nasbírala celkem za ${a} až ${b}` },
];

function l2Rozsah(): PracticeTask | null {
  const k = pickK(K2_ROZSAH);
  const d = jedenRadek(k, rnd(5, 6));
  if (!d) return null;
  const { cols, vals, tab } = d;
  const n = cols.length;
  const s = rnd(0, n - 3);
  const e = s + 2;
  const vyb = vals.slice(s, e + 1);
  const klic = soucet(vyb);
  const kands: Kand[] = [
    { h: soucet(vals.slice(s, e)), why: `Vynechal jsi sloupec „${cols[e].h}“. Rozsah „za … až …“ zahrnuje i poslední sloupec.` },
    { h: soucet(vals.slice(s + 1, e + 1)), why: `Vynechal jsi sloupec „${cols[s].h}“. Rozsah začíná prvním jmenovaným sloupcem a ten do součtu patří.` },
    { h: soucet(vals), why: `Sečetl jsi celý řádek. Otázka se ptá jen na sloupce od „${cols[s].h}“ do „${cols[e].h}“.` },
  ];
  if (e + 1 < n) {
    kands.push({ h: soucet(vals.slice(s + 1, e + 2)), why: `Posunul ses o sloupec vpravo: sečetl jsi „${cols[s + 1].h}“ až „${cols[e + 1].h}“. Začni sloupcem „${cols[s].h}“.` });
  }
  if (!k.penize) {
    const z = zarovnaneVpravo(vyb, "+");
    if (z !== null) kands.push({ h: z, why: `Čísla s různým počtem desetinných míst jsi sečetl zarovnaná vpravo. ${CARKA}` });
  }
  if (maCarku(tab)) kands.push({ h: klic * 10, why: `Ve výsledku je čárka o jedno místo jinde. ${CARKA}` });
  const vybrane = vyber(k, klic, shuffle(kands), false);
  const cela = `${k.hlavicka === "Den" ? "dny" : "měsíce"} od „${cols[s].h}“ do „${cols[e].h}“`;
  return uloha(tab, `Vypočítej z tabulky, ${k.rozsah(cols[s].acc, cols[e].acc)}.`, hodn(k, klic), naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: Najdi v záhlaví všechny ${cela} a vypiš si čísla, která pod nimi stojí.`,
      `Krok 2: Slovo „až“ znamená, že do součtu patří první i poslední jmenovaný sloupec i všechny mezi nimi.`,
      maCarku(tab) ? `Krok 3: Vypsaná čísla sečti. ${CARKA}` : `Krok 3: Vypsaná čísla sečti a výsledek porovnej s odhadem.`,
    ],
    solutionSteps: [
      `Sloupce od „${cols[s].h}“ do „${cols[e].h}“: ${vypis(k, vyb)}.`,
      `Součet: ${plusy(k, vyb)} = ${mezisoucet(k, klic, vyb)}`,
      `Odpověď: ${hodn(k, klic)}.`,
    ],
    explanation: `Rozsah „za ${cols[s].acc} až ${cols[e].acc}“ zahrnuje oba krajní sloupce i sloupec mezi nimi, proto sečteme tři čísla: ${plusy(k, vyb)} = ${hodn(k, klic)}.`,
  });
}

interface K2Rozdil extends Zaklad {
  rozdil: (a: Sl, b: Sl) => string;
}
const K2_ROZDIL: K2Rozdil[] = [
  { ...TEPLOTY, rozdil: (a, b) => `o kolik stupňů bylo ${a.lok} tepleji než ${b.lok}` },
  { ...SKOK, rozdil: (a, b) => `o kolik metrů skočil${a.m ? "" : "a"} ${a.h} dál než ${b.h}` },
  { ...ROSTLINY_K, rozdil: (a, b) => `o kolik centimetrů byla výška ${a.lok} větší než výška ${b.lok}` },
  { ...TRZBY, rozdil: (a, b) => `o kolik korun stánek utržil ${a.lok} více než ${b.lok}` },
];

function l2Rozdil(): PracticeTask | null {
  const k = pickK(K2_ROZDIL);
  const d = jedenRadek(k, rnd(5, 6));
  if (!d) return null;
  const { cols, vals, tab } = d;
  const n = cols.length;
  const iA = rnd(0, n - 1);
  const iB = rnd(0, n - 1);
  if (iA === iB || vals[iA] <= vals[iB]) return null;
  const a = vals[iA], b = vals[iB];
  const klic = a - b;
  const kands: Kand[] = [
    { h: a + b, why: `Čísla jsi sečetl. Otázka „o kolik více“ se ptá na rozdíl: od většího čísla odečti menší.` },
  ];
  for (const j of shuffle([iB - 1, iB + 1])) {
    if (j >= 0 && j < n && j !== iA) {
      kands.push({ h: a - vals[j], why: `Místo sloupce „${cols[iB].h}“ jsi vzal sousední sloupec „${cols[j].h}“. Veď prstem nejdřív po záhlaví, pak dolů.` });
    }
  }
  for (const j of shuffle([iA - 1, iA + 1])) {
    if (j >= 0 && j < n && j !== iB) {
      kands.push({ h: vals[j] - b, why: `Místo sloupce „${cols[iA].h}“ jsi vzal sousední sloupec „${cols[j].h}“. Veď prstem nejdřív po záhlaví, pak dolů.` });
    }
  }
  if (!k.penize) {
    const z = zarovnaneVpravo([a, b], "-");
    if (z !== null) kands.push({ h: z, why: `Čísla s různým počtem desetinných míst jsi odečetl zarovnaná vpravo. ${CARKA}` });
  }
  if (maCarku(tab)) {
    kands.push({ h: klic * 10, why: `Ve výsledku je čárka o jedno místo jinde. ${CARKA}` });
    kands.push({ h: delH(klic, 10), why: `Ve výsledku je čárka o jedno místo jinde. ${CARKA}` });
  }
  const [prvni, ...zbytek] = kands;
  const vybrane = vyber(k, klic, [prvni, ...shuffle(zbytek)], false);
  return uloha(tab, `Vypočítej z tabulky, ${k.rozdil(cols[iA], cols[iB])}.`, hodn(k, klic), naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: Najdi v tabulce čísla ve sloupcích „${cols[iA].h}“ a „${cols[iB].h}“.`,
      `Krok 2: Slova „o kolik“ znamenají rozdíl: od čísla ze sloupce „${cols[iA].h}“ odečti číslo ze sloupce „${cols[iB].h}“.`,
      maCarku(tab) ? `Krok 3: ${CARKA}` : `Krok 3: Výsledek ověř sčítáním.`,
    ],
    solutionSteps: [
      `Sloupec „${cols[iA].h}“: ${hodn(k, a)}, sloupec „${cols[iB].h}“: ${hodn(k, b)}.`,
      `Rozdíl: ${bunka(k, a)} − ${bunka(k, b)} = ${mezisoucet(k, klic, [a, b])}`,
      `Zkouška: ${bunka(k, b)} + ${bunka(k, klic)} = ${bunka(k, a)}`,
    ],
    explanation: `Otázka „o kolik více“ se ptá na rozdíl dvou hodnot, proto od většího čísla odečteme menší: ${bunka(k, a)} − ${bunka(k, b)} = ${hodn(k, klic)}.`,
  });
}

interface K2Celkem extends Zaklad {
  skupiny?: [string, string];
  celkem: (skupina: string) => string;
}
const K2_CELKEM: K2Celkem[] = [
  { ...TRZBY, celkem: () => `kolik korun stánek utržil celkem za všechny dny v tabulce` },
  { ...SRAZKY, celkem: () => `kolik srážek spadlo celkem za všechny měsíce v tabulce` },
  {
    ...KNIHY, titulek: "Počet knih, které přečetli žáci dvou tříd", hlavicka: "Měsíc", pool: SKOLNI, poradi: true,
    krok: 100, min: 500, max: 4000, skupiny: ["6.A", "6.B"],
    celkem: (s) => `kolik knih přečetli žáci třídy ${s} celkem za všechny měsíce v tabulce`,
  },
  {
    ...PAPIR, titulek: "Sběr papíru dvou tříd po měsících (v kilogramech)", skupiny: ["6.A", "6.B"],
    celkem: (s) => `kolik papíru nasbírala třída ${s} celkem za všechny měsíce v tabulce`,
  },
];

function l2Celkem(): PracticeTask | null {
  const k = pickK(K2_CELKEM);
  const n = rnd(4, 6);
  const cols = vyberSloupce(k, n);
  const r = rnd(0, 1);
  const radky = (k.skupiny ?? [k.radek]).map((label) => ({ label, vals: hodnoty(k, n) }));
  const vals = radky[k.skupiny ? r : 0].vals;
  const tab = tabulka(k, cols, radky);
  if (k.krok < 100 && !k.penize && !radky.some((x) => x.vals.some((v) => v % 100 !== 0))) return null;
  const klic = soucet(vals);
  const skup = k.skupiny ? k.skupiny[r] : "";
  const kands: Kand[] = [
    { h: klic - vals[n - 1], why: `Vynechal jsi poslední sloupec „${cols[n - 1].h}“. Celkem znamená všechny sloupce řádku.` },
    { h: klic - vals[0], why: `Vynechal jsi první sloupec „${cols[0].h}“. Celkem znamená všechny sloupce řádku.` },
  ];
  if (k.skupiny) {
    const jina = radky[1 - r];
    kands.push({ h: klic + soucet(jina.vals), why: `Sečetl jsi obě třídy. Otázka se ptá jen na třídu ${skup}.` });
    kands.push({ h: soucet(jina.vals), why: `Sečetl jsi řádek třídy ${jina.label}, ne třídy ${skup}.` });
  }
  if (!k.penize) {
    const z = zarovnaneVpravo(vals, "+");
    if (z !== null) kands.push({ h: z, why: `Čísla s různým počtem desetinných míst jsi sečetl zarovnaná vpravo. ${CARKA}` });
  }
  if (maCarku(tab)) kands.push({ h: klic * 10, why: `Ve výsledku je čárka o jedno místo jinde. ${CARKA}` });
  const vybrane = vyber(k, klic, shuffle(kands), false);
  const radekText = k.skupiny ? `řádku „${skup}“` : `řádku „${k.radek}“`;
  return uloha(tab, `Vypočítej z tabulky, ${k.celkem(skup)}.`, hodn(k, klic), naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: Najdi v tabulce ${k.skupiny ? `řádek „${skup}“ (druhý řádek s daty nech stranou)` : `řádek „${k.radek}“`}.`,
      `Krok 2: Sečti všechna čísla v ${radekText} od sloupce „${cols[0].h}“ po sloupec „${cols[n - 1].h}“, žádné nevynech.`,
      maCarku(tab) ? `Krok 3: ${CARKA}` : `Krok 3: Nakonec zkontroluj, že jsi sečetl tolik čísel, kolik je sloupců.`,
    ],
    solutionSteps: [
      `Čísla v ${radekText}: ${vypis(k, vals)}.`,
      `Součet: ${plusy(k, vals)} = ${mezisoucet(k, klic, vals)}`,
      `Odpověď: ${hodn(k, klic)}.`,
    ],
    explanation: `„Celkem za všechny“ znamená sečíst všechna čísla v ${radekText}, od prvního sloupce po poslední: ${plusy(k, vals)} = ${hodn(k, klic)}.`,
  });
}

interface K2Trid extends Zaklad {
  skupiny: { label: string; gen: string }[];
  nebo: (skup: { label: string; gen: string }, a: Sl, b: Sl) => string;
  obe: (a: Sl) => string;
}
const K2_TRIDENI: K2Trid[] = [
  {
    titulek: "Odpovědi žáků na otázku, jak se dopravují do školy", hlavicka: "Odpověď", pool: DOPRAVA, poradi: false,
    radek: "", jed: "", krok: 100, min: 200, max: 1800,
    skupiny: [{ label: "chlapci", gen: "chlapců" }, { label: "dívky", gen: "dívek" }],
    nebo: (s, a, b) => `kolik ${s.gen} odpovědělo „${a.h}“ nebo „${b.h}“`,
    obe: (a) => `kolik žáků z obou skupin odpovědělo „${a.h}“`,
  },
  {
    titulek: "Odpovědi žáků na otázku, jaký sport mají nejraději", hlavicka: "Odpověď", pool: SPORTY, poradi: false,
    radek: "", jed: "", krok: 100, min: 200, max: 1800,
    skupiny: [{ label: "chlapci", gen: "chlapců" }, { label: "dívky", gen: "dívek" }],
    nebo: (s, a, b) => `kolik ${s.gen} odpovědělo „${a.h}“ nebo „${b.h}“`,
    obe: (a) => `kolik žáků z obou skupin odpovědělo „${a.h}“`,
  },
  {
    titulek: "Hlasování dvou šestých tříd o cíli výletu", hlavicka: "Cíl", pool: CILE, poradi: false,
    radek: "", jed: "", krok: 100, min: 200, max: 1500,
    skupiny: [{ label: "6.A", gen: "žáků 6.A" }, { label: "6.B", gen: "žáků 6.B" }],
    nebo: (s, a, b) => `kolik ${s.gen} hlasovalo ${a.lok} nebo ${b.lok}`,
    obe: (a) => `kolik žáků z obou tříd hlasovalo ${a.lok}`,
  },
];

function l2Trideni(): PracticeTask | null {
  const k = pickK(K2_TRIDENI);
  const n = rnd(4, 5);
  const cols = vyberSloupce(k, n);
  const radky = k.skupiny.map((s) => ({ label: s.label, vals: hodnoty(k, n) }));
  const tab = tabulka(k, cols, radky);
  const bezJed = k;

  if (Math.random() < 0.5) {
    // „A nebo B“ v jednom řádku
    const r = rnd(0, 1);
    const sk = k.skupiny[r];
    const v = radky[r].vals;
    const jine = radky[1 - r].vals;
    const [iA, iB] = shuffle([...Array(n).keys()]).slice(0, 2).sort((x, y) => x - y);
    const klic = v[iA] + v[iB];
    const jinyRadek = radky[1 - r].label;
    // Nejčastější omyl u dvouřádkové tabulky: správné sloupce ve špatném
    // řádku. Stojí první, aby se do nabídky dostal vždy (vyber() ho zahodí,
    // jen když vyjde stejně jako klíč). Omyl s jedním sloupcem stačí jednou.
    const jedenSloupec = shuffle([
      { h: v[iA], why: `Započítal jsi jen sloupec „${cols[iA].h}“. Slovo „nebo“ znamená, že patří i sloupec „${cols[iB].h}“, obě čísla sečti.` },
      { h: v[iB], why: `Započítal jsi jen sloupec „${cols[iB].h}“. Slovo „nebo“ znamená, že patří i sloupec „${cols[iA].h}“, obě čísla sečti.` },
    ]);
    const kands: Kand[] = [
      { h: jine[iA] + jine[iB], why: `Sečetl jsi správné sloupce, ale v řádku „${jinyRadek}“. Otázka se ptá na řádek „${sk.label}“.` },
      ...shuffle([
        jedenSloupec[0],
        { h: soucet(v), why: `Sečetl jsi celý řádek „${sk.label}“. Počítají se jen dva jmenované sloupce.` },
        { h: Math.abs(v[iA] - v[iB]), why: `Spočítal jsi rozdíl. Slovo „nebo“ znamená sloučit obě skupiny odpovědí, tedy sečíst.` },
        { h: v[iA] + jine[iB], why: `Jedno číslo jsi vzal z řádku „${jinyRadek}“. Obě čísla patří do řádku „${sk.label}“.` },
      ]),
      jedenSloupec[1],
    ];
    return uloha(tab, `Vypočítej z tabulky, ${k.nebo(sk, cols[iA], cols[iB])}.`, cis(klic / 100), naDistraktory(bezJed, vyber(k, klic, kands, false)), {
      hints: [
        `Krok 1: Najdi řádek „${sk.label}“ a v něm sloupce „${cols[iA].h}“ a „${cols[iB].h}“.`,
        `Krok 2: Slovo „nebo“ znamená, že patří do výsledku obě skupiny odpovědí: čísla z obou sloupců v řádku „${sk.label}“ sečti.`,
      ],
      solutionSteps: [
        `Řádek „${sk.label}“: ve sloupci „${cols[iA].h}“ je ${cis(v[iA] / 100)}, ve sloupci „${cols[iB].h}“ je ${cis(v[iB] / 100)}.`,
        `Součet: ${cis(v[iA] / 100)} + ${cis(v[iB] / 100)} = ${cis(klic / 100)}`,
      ],
      explanation: `Každý žák dal jednu odpověď, takže skupiny „${cols[iA].h}“ a „${cols[iB].h}“ se nepřekrývají a můžeme je sečíst: ${cis(v[iA] / 100)} + ${cis(v[iB] / 100)} = ${cis(klic / 100)}.`,
    });
  }

  // jeden sloupec z obou řádků
  const i = rnd(0, n - 1);
  const [r1, r2] = [radky[0].vals, radky[1].vals];
  const klic = r1[i] + r2[i];
  const sousede = [i - 1, i + 1].filter((j) => j >= 0 && j < n);
  const j = sousede[rnd(0, sousede.length - 1)];
  const kands: Kand[] = shuffle([
    { h: r1[i], why: `Započítal jsi jen řádek „${radky[0].label}“. Otázka se ptá na obě skupiny, přičti i řádek „${radky[1].label}“.` },
    { h: r2[i], why: `Započítal jsi jen řádek „${radky[1].label}“. Otázka se ptá na obě skupiny, přičti i řádek „${radky[0].label}“.` },
    { h: r1[i] + r2[j], why: `Ve druhém řádku jsi vzal sousední sloupec „${cols[j].h}“. Obě čísla musí být ve sloupci „${cols[i].h}“.` },
    { h: Math.abs(r1[i] - r2[i]), why: `Spočítal jsi rozdíl skupin. „Z obou skupin“ znamená obě čísla sečíst.` },
    { h: r1[j] + r2[j], why: `Sečetl jsi sousední sloupec „${cols[j].h}“. Veď prstem nejdřív po záhlaví ke sloupci „${cols[i].h}“.` },
  ]);
  return uloha(tab, `Vypočítej z tabulky, ${k.obe(cols[i])}.`, cis(klic / 100), naDistraktory(bezJed, vyber(k, klic, kands, false)), {
    hints: [
      `Krok 1: Najdi v záhlaví sloupec „${cols[i].h}“.`,
      `Krok 2: V tomto sloupci přečti číslo v řádku „${radky[0].label}“ i v řádku „${radky[1].label}“ a obě sečti, protože otázka se ptá na obě skupiny.`,
    ],
    solutionSteps: [
      `Sloupec „${cols[i].h}“: ${radky[0].label} ${cis(r1[i] / 100)}, ${radky[1].label} ${cis(r2[i] / 100)}.`,
      `Součet: ${cis(r1[i] / 100)} + ${cis(r2[i] / 100)} = ${cis(klic / 100)}`,
    ],
    explanation: `Otázka se ptá na obě skupiny dohromady, proto sečteme obě čísla ze sloupce „${cols[i].h}“: ${cis(r1[i] / 100)} + ${cis(r2[i] / 100)} = ${cis(klic / 100)}.`,
  });
}

// ── L3 — analýza a vyvození ────────────────────────────────────────────────
interface K3 extends Zaklad {
  prumer: string;
  inverze: (x: string) => string;
  rozpeti: string;
  /** Nejvýš tolik desetinných míst smí mít průměr (celé počty knih → 1). */
  maxMistPrumeru: number;
}
const K3_KONTEXTY: K3[] = [
  {
    ...TEPLOTY, maxMistPrumeru: 2,
    prumer: "Urči průměrnou polední teplotu za dny v tabulce.",
    inverze: (x) => `Průměrná polední teplota za dny v tabulce byla ${x}.`,
    rozpeti: "Zjisti, o kolik se lišila nejvyšší a nejnižší teplota v tabulce.",
  },
  {
    ...SKOK, maxMistPrumeru: 2,
    prumer: "Urči průměrnou délku skoku žáků v tabulce.",
    inverze: (x) => `Průměrná délka skoku byla ${x}.`,
    rozpeti: "Zjisti, o kolik se lišil nejdelší a nejkratší skok v tabulce.",
  },
  {
    ...TRZBY, maxMistPrumeru: 2,
    prumer: "Urči, kolik korun stánek utržil průměrně za jeden den.",
    inverze: (x) => `Průměrná denní tržba byla ${x}.`,
    rozpeti: "Zjisti, o kolik se lišila nejvyšší a nejnižší denní tržba.",
  },
  {
    ...SRAZKY, maxMistPrumeru: 2,
    prumer: "Urči průměrné množství srážek za jeden měsíc.",
    inverze: (x) => `Průměrné množství srážek za měsíc bylo ${x}.`,
    rozpeti: "Zjisti, o kolik se lišilo největší a nejmenší měsíční množství srážek.",
  },
  {
    ...ROSTLINY_K, maxMistPrumeru: 2,
    prumer: "Urči průměrnou výšku rostlin v tabulce.",
    inverze: (x) => `Průměrná výška rostlin v tabulce byla ${x}.`,
    rozpeti: "Zjisti, o kolik se lišila výška nejvyšší a nejnižší rostliny.",
  },
  {
    ...KNIHY, maxMistPrumeru: 1,
    prumer: "Urči, kolik knih přečetl jeden žák v průměru.",
    inverze: (x) => `Průměrný počet přečtených knih na jednoho žáka byl ${x}.`,
    rozpeti: "",
  },
  {
    ...KNIHOVNA, maxMistPrumeru: 1,
    prumer: "Urči průměrný počet návštěvníků knihovny za jeden den.",
    inverze: (x) => `Průměrný počet návštěvníků za den byl ${x}.`,
    rozpeti: "",
  },
];

function l3Data(k: K3, n: number): { cols: Sl[]; vals: number[]; S: number; avg: number } | null {
  const cols = vyberSloupce(k, n);
  const vals = hodnoty(k, cols.length);
  if (k.krok < 100 && !k.penize && !vals.some((v) => v % 100 !== 0)) return null;
  const S = soucet(vals);
  const avg = delH(S, cols.length);
  if (!Number.isInteger(avg) || dp(avg) > k.maxMistPrumeru) return null;
  return { cols, vals, S, avg };
}

function l3Prumer(): PracticeTask | null {
  const k = pickK(K3_KONTEXTY);
  const d = l3Data(k, rnd(4, 6));
  if (!d) return null;
  const { cols, vals, S, avg } = d;
  const n = cols.length;
  const tab = tabulka(k, cols, [{ label: k.radek, vals }]);
  const kands: Kand[] = [
    { h: S, why: `Tohle je součet všech hodnot. Průměr dostaneš, až součet vydělíš počtem hodnot.` },
    { h: delH(S, n - 1), why: `Dělil jsi číslem ${n - 1}, ale počet hodnot v řádku je ${n}. Spočítej sloupce ještě jednou.` },
    { h: delH(S, n + 1), why: `Dělil jsi číslem ${n + 1}, ale počet hodnot v řádku je ${n}. Popisek řádku se nepočítá.` },
  ];
  for (const j of shuffle([...Array(n).keys()]).slice(0, 2)) {
    kands.push({ h: delH(S - vals[j], n), why: `Při sčítání jsi vynechal hodnotu ve sloupci „${cols[j].h}“. Sečti všechna čísla v řádku.` });
    kands.push({ h: delH(S - vals[j], n - 1), why: `Spočítal jsi průměr bez sloupce „${cols[j].h}“. Do průměru patří všechny hodnoty v řádku.` });
  }
  if (!k.penize) {
    const z = zarovnaneVpravo(vals, "+");
    if (z !== null) kands.push({ h: delH(z, n), why: `Čísla s různým počtem desetinných míst jsi sečetl zarovnaná vpravo. ${CARKA}` });
  }
  const vybrane = vyber(k, avg, shuffle(kands), true);
  const klic = hodn(k, avg);
  return uloha(tab, k.prumer, klic, naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: Průměr: sečti všechny hodnoty v řádku „${k.radek}“ od sloupce „${cols[0].h}“ po sloupec „${cols[n - 1].h}“.`,
      `Krok 2: Součet vyděl počtem hodnot. Počítají se jen sloupce s čísly, popisek řádku ne.`,
      `Krok 3: Průměr musí ležet mezi nejmenší a největší hodnotou v tabulce.`,
    ],
    solutionSteps: [
      `Hodnoty: ${vypis(k, vals)}.`,
      `Součet: ${plusy(k, vals)} = ${mezisoucet(k, S, vals)}`,
      `Počet hodnot: ${n}.`,
      `Průměr: ${bunka(k, S)} : ${n} = ${klic}`,
    ],
    explanation: `Aritmetický průměr je součet všech hodnot vydělený jejich počtem. Součet je ${bunka(k, S)}, hodnot je v řádku ${n}, proto průměr je ${bunka(k, S)} : ${n} = ${klic}.`,
  }, true);
}

function l3Inverze(): PracticeTask | null {
  const k = pickK(K3_KONTEXTY);
  const d = l3Data(k, rnd(4, 5));
  if (!d) return null;
  const { cols, vals, S, avg } = d;
  const n = cols.length;
  const j = rnd(0, n - 1);
  const klicH = vals[j];
  if (klicH === avg) return null;
  const zname = vals.filter((_, i) => i !== j);
  const K = soucet(zname);
  const radek = vals.map((v, i) => (i === j ? null : v));
  const tab = tabulka(k, cols, [{ label: k.radek, vals: radek }]);
  const X = hodn(k, avg);
  const kands: Kand[] = [
    { h: avg, why: `Průměr není chybějící hodnota. Nejdřív spočítej součet všech hodnot: průměr krát počet hodnot.` },
    { h: (n - 1) * avg - K, why: `Průměr jsi násobil číslem ${n - 1}, tedy jen počtem známých hodnot. Průměr se ale počítal ze všech ${n} hodnot včetně chybějící.` },
    { h: (n + 1) * avg - K, why: `Průměr jsi násobil číslem ${n + 1}. Hodnot je v řádku ${n}, i s otazníkem.` },
    { h: delH(K, n - 1), why: `Spočítal jsi průměr známých hodnot. Hledáš ale číslo, které doplní součet na průměr krát počet hodnot.` },
  ];
  for (const i of shuffle([...Array(n).keys()].filter((x) => x !== j)).slice(0, 2)) {
    kands.push({ h: klicH + vals[i], why: `Zapomněl jsi odečíst hodnotu ze sloupce „${cols[i].h}“. Od součtu odečti všechna známá čísla.` });
    kands.push({ h: klicH - vals[i], why: `Hodnotu ze sloupce „${cols[i].h}“ jsi odečetl dvakrát.` });
  }
  const vybrane = vyber(k, klicH, shuffle(kands), true);
  const klic = hodn(k, klicH);
  if (X === klic || zname.some((v) => v === klicH)) return null;
  return uloha(tab, `${k.inverze(X)} Zjisti, jaké číslo patří místo otazníku.`, klic, naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: Průměr krát počet hodnot v řádku „${k.radek}“ (i se sloupcem „${cols[j].h}“, kde je otazník) dá součet všech hodnot.`,
      `Krok 2: Od tohoto součtu odečti všechna známá čísla ze sloupců kromě „${cols[j].h}“. Co zbyde, patří místo otazníku.`,
      `Krok 3: Nakonec si výsledek ověř zkouškou: spočítej průměr doplněné tabulky.`,
    ],
    solutionSteps: [
      `Součet všech hodnot = průměr · počet hodnot = ${bunka(k, avg)} · ${n} = ${bunka(k, S)}`,
      `Součet známých hodnot: ${plusy(k, zname)} = ${mezisoucet(k, K, zname)}`,
      `Chybějící hodnota: ${bunka(k, S)} − ${bunka(k, K)} = ${klic}`,
      `Zkouška: (${bunka(k, K)} + ${bunka(k, klicH)}) : ${n} = ${X}`,
    ],
    explanation: `Z průměru zjistíme součet všech hodnot: průměr krát jejich počet. Chybějící číslo je to, co zbude po odečtení známých hodnot: ${bunka(k, S)} − ${bunka(k, K)} = ${klic}.`,
  }, true);
}

interface K3Skup extends Zaklad {
  skupiny: [string, string];
  otazka: string;
  maxMistPrumeru: number;
}
const K3_SKUPINY: K3Skup[] = [
  {
    ...PAPIR, titulek: "Sběr papíru dvou tříd po měsících (v kilogramech)", skupiny: ["6.A", "6.B"], maxMistPrumeru: 2,
    otazka: "Urči, která třída nasbírala za měsíc v průměru více papíru a o kolik.",
  },
  {
    ...TEPLOTY, titulek: "Polední teploty ve dvou městech (ve stupních Celsia)", skupiny: ["Brno", "Olomouc"], maxMistPrumeru: 2,
    otazka: "Urči, které město mělo vyšší průměrnou polední teplotu a o kolik.",
  },
  {
    ...KNIHY, titulek: "Počet knih, které přečetli žáci dvou tříd", hlavicka: "Měsíc", pool: SKOLNI, poradi: true,
    min: 500, max: 4000, skupiny: ["6.A", "6.B"], maxMistPrumeru: 1,
    otazka: "Urči, která třída přečetla za měsíc v průměru více knih a o kolik.",
  },
  {
    ...TRZBY, titulek: "Tržby dvou stánků v korunách", skupiny: ["Stánek A", "Stánek B"], maxMistPrumeru: 2,
    otazka: "Urči, který stánek měl vyšší průměrnou denní tržbu a o kolik.",
  },
];

function l3Skupiny(): PracticeTask | null {
  const k = pickK(K3_SKUPINY);
  const n = rnd(4, 5);
  const cols = vyberSloupce(k, n);
  const r = [hodnoty(k, n), hodnoty(k, n)];
  if (k.krok < 100 && !k.penize && !r.flat().some((v) => v % 100 !== 0)) return null;
  const S = r.map(soucet);
  const A = S.map((s) => delH(s, n));
  if (A.some((a) => !Number.isInteger(a) || dp(a) > k.maxMistPrumeru) || A[0] === A[1]) return null;
  const w = A[0] > A[1] ? 0 : 1;
  const W = k.skupiny[w], L = k.skupiny[1 - w];
  const dH = A[w] - A[1 - w];
  const tab = tabulka(k, cols, [{ label: k.skupiny[0], vals: r[0] }, { label: k.skupiny[1], vals: r[1] }]);
  const moz = (g: string, h: number) => `${g} o ${hodn(k, h)}`;
  const klic = moz(W, dH);
  const kands: { g: string; h: number; why: string }[] = shuffle([
    { g: L, h: dH, why: `Rozdíl je správně, ale přehodil jsi řádky: vyšší průměr má ${W}, ne ${L}.` },
    { g: W, h: S[w] - S[1 - w], why: `Tohle je rozdíl součtů. Otázka se ptá na průměry: každý součet nejdřív vyděl počtem hodnot.` },
    { g: L, h: S[w] - S[1 - w], why: `Tohle je rozdíl součtů, a navíc s přehozenými řádky. Nejdřív spočítej oba průměry, pak je porovnej.` },
    { g: W, h: A[0] + A[1], why: `Průměry jsi sečetl. Slova „o kolik“ se ptají na rozdíl průměrů.` },
    { g: W, h: delH(S[w] - S[1 - w], n - 1), why: `Součty jsi dělil číslem ${n - 1}, ale v každém řádku je ${n} hodnot.` },
  ]);
  const seen = new Set<string>([klic]);
  const distractors: Distractor[] = [];
  for (const c of kands) {
    if (!Number.isInteger(c.h) || c.h <= 0) continue;
    if (!k.penize && dp(c.h) !== dp(dH)) continue;
    const v = moz(c.g, c.h);
    if (seen.has(v)) continue;
    seen.add(v);
    distractors.push({ value: v, why: c.why });
  }
  return uloha(tab, k.otazka, klic, distractors, {
    hints: [
      `Krok 1: Pro řádek „${k.skupiny[0]}“ i pro řádek „${k.skupiny[1]}“ zvlášť sečti hodnoty a součet vyděl jejich počtem.`,
      `Krok 2: Oba průměry porovnej: od většího odečti menší a zapamatuj si, ke kterému řádku větší průměr patří. Součty samotné neporovnávej.`,
    ],
    solutionSteps: [
      `${k.skupiny[0]}: ${plusy(k, r[0])} = ${mezisoucet(k, S[0], r[0])}; průměr ${bunka(k, S[0])} : ${n} = ${hodn(k, A[0])}`,
      `${k.skupiny[1]}: ${plusy(k, r[1])} = ${mezisoucet(k, S[1], r[1])}; průměr ${bunka(k, S[1])} : ${n} = ${hodn(k, A[1])}`,
      `Vyšší průměr má ${W}: ${bunka(k, A[w])} − ${bunka(k, A[1 - w])} = ${hodn(k, dH)}`,
    ],
    explanation: `Skupiny porovnáváme podle průměrů: každý součet vydělíme počtem hodnot. ${W} má průměr ${hodn(k, A[w])}, ${L} ${hodn(k, A[1 - w])}, takže ${W} má průměr vyšší o ${hodn(k, dH)}.`,
  }, true);
}

function l3Rozpeti(): PracticeTask | null {
  const k = pickK(K3_KONTEXTY.filter((x) => x.rozpeti));
  const d = jedenRadek(k, rnd(5, 6));
  if (!d) return null;
  const { cols, vals, tab } = d;
  const n = cols.length;
  const ser = [...vals].sort((a, b) => a - b);
  const mx = ser[n - 1], mn = ser[0];
  const klicH = mx - mn;
  const iMx = vals.indexOf(mx), iMn = vals.indexOf(mn);
  const i2Mn = vals.indexOf(ser[1]), i2Mx = vals.indexOf(ser[n - 2]);
  const kands: Kand[] = shuffle([
    { h: Math.abs(vals[n - 1] - vals[0]), why: `Odečetl jsi první a poslední hodnotu v řádku. Rozdíl počítáš z největší a nejmenší hodnoty, ne z první a poslední.` },
    { h: mx + mn, why: `Největší a nejmenší hodnotu jsi sečetl. Slova „o kolik se lišila“ se ptají na rozdíl.` },
    { h: mx - ser[1], why: `Jako nejmenší jsi vzal hodnotu ze sloupce „${cols[i2Mn].h}“, ale ve sloupci „${cols[iMn].h}“ je ještě menší.` },
    { h: ser[n - 2] - mn, why: `Jako největší jsi vzal hodnotu ze sloupce „${cols[i2Mx].h}“, ale ve sloupci „${cols[iMx].h}“ je ještě větší.` },
  ]);
  if (!k.penize) {
    const z = zarovnaneVpravo([mx, mn], "-");
    if (z !== null) kands.push({ h: z, why: `Čísla s různým počtem desetinných míst jsi odečetl zarovnaná vpravo. ${CARKA}` });
  }
  const vybrane = vyber(k, klicH, kands, true);
  const klic = hodn(k, klicH);
  return uloha(tab, k.rozpeti, klic, naDistraktory(k, vybrane), {
    hints: [
      `Krok 1: V řádku „${k.radek}“ porovnej všech ${pad(n, "ČÍSLO")} od sloupce „${cols[0].h}“ po sloupec „${cols[n - 1].h}“ a najdi největší a nejmenší z nich.`,
      `Krok 2: Krajní sloupce nemusí obsahovat krajní hodnoty. Od největšího čísla odečti nejmenší. ${CARKA}`,
    ],
    solutionSteps: [
      `Hodnoty: ${vypis(k, vals)}.`,
      `Největší je ${hodn(k, mx)} (sloupec „${cols[iMx].h}“), nejmenší ${hodn(k, mn)} (sloupec „${cols[iMn].h}“).`,
      `Rozdíl: ${bunka(k, mx)} − ${bunka(k, mn)} = ${mezisoucet(k, klicH, [mx, mn])}`,
    ],
    explanation: `Nejdřív musíme v celém řádku najít obě krajní hodnoty, teprve pak je odečíst: ${bunka(k, mx)} − ${bunka(k, mn)} = ${klic}. Na pořadí sloupců nezáleží.`,
  }, true);
}

// ── Generátor ──────────────────────────────────────────────────────────────
const genL1 = rotuj([l1Hodnota, l1Extrem, l1Prah]);
const genL2 = rotuj([l2Rozsah, l2Rozdil, l2Celkem, l2Trideni]);
const genL3 = rotuj([l3Prumer, l3Inverze, l3Skupiny, l3Rozpeti]);

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const TABULKY_A_DIAGRAMY: TopicMetadata[] = [
  {
    id: "g6-mat-tabulky-a-diagramy-6",
    rvpNodeId: "g6-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-sber-a-trideni-dat-tabulky-diagramy",
    displayName: "Tabulky a průměr",
    title: "Sběr a třídění dat, tabulky, diagramy",
    studentTitle: "Tabulky a data",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Čteš údaje z tabulky, porovnáváš je, sčítáš a počítáš průměr.",
    keywords: [
      "tabulka", "diagram", "sloupcový diagram", "data", "třídění dat", "aritmetický průměr",
      "největší hodnota", "nejmenší hodnota", "součet", "rozdíl", "četnost", "desetinná čísla",
    ],
    goals: [
      "Přečíst z tabulky hodnotu a najít největší nebo nejmenší údaj.",
      "Sečíst údaje za vybrané sloupce, spočítat rozdíl dvou údajů a roztřídit odpovědi.",
      "Spočítat aritmetický průměr a doplnit chybějící údaj, když průměr znáš.",
      "Porovnat dvě skupiny dat podle průměru a zjistit, o kolik se liší největší a nejmenší údaj.",
    ],
    boundaries: [
      "Tabulka je zapsaná v zadání, bez obrázku; sloupcový diagram se převádí na tabulku.",
      "Přirozená a desetinná čísla s nejvýš dvěma desetinnými místy, jen kladné hodnoty.",
      "Bez procent, zlomků, kruhového diagramu, modu a mediánu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    prerequisites: ["g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek"],
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív najdi v záhlaví správný sloupec a v popiscích správný řádek, teprve potom čti číslo. Průměr: sečti všechny hodnoty a vyděl jejich počtem.",
      steps: [
        "Přečti nadpis tabulky a popisky řádků, ať víš, co čísla znamenají.",
        "Najdi v záhlaví sloupce, na které se otázka ptá, a veď prstem dolů.",
        "Rozhodni, jestli máš čísla sečíst, odečíst, nebo spočítat průměr.",
        "Desetinná čísla zapisuj pod sebe tak, aby čárka byla pod čárkou.",
      ],
      commonMistake: "Číslo ze sousedního sloupce, vynechaný krajní sloupec u rozsahu „až“ nebo průměr dělený špatným počtem hodnot.",
      example: "Den: Po | Út | St, Teplota (°C): 12,4 | 15,1 | 13,6. Průměr: (12,4 + 15,1 + 13,6) : 3 = 41,1 : 3 = 13,7 °C.",
    },
  },
];
