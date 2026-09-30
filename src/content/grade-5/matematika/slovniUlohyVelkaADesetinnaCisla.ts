import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { fmt, fkc, rnd, pick, shuffle } from "./_mat";

// Slovní úlohy — 5. ročník (2026-09-30).
//
// Navazuje na „Příběhy s velkými čísly" ze 4. ročníku, ale v rozsahu 5. ročníku:
// čísla přes 10 000, násobení a dělení dvojciferným číslem, koruny s desetinnou
// čárkou (jen sčítání a odčítání — násobení desetinných čísel 5. ročník nemá)
// a aritmetický průměr.
// Úrovně: L1 jeden krok, vybrat ze čtyř operací · L2 dva kroky za sebou
// (nákup a vrácení, rozpočet, průměr) · L3 přenos: počítání pozpátku,
// součet a rozdíl, trojčlenka přes cenu jednoho kusu, chybějící hodnota do průměru.
//
// Distraktory jsou typické chyby a každá nese vysvětlení. Počítané věci mají
// vždy aspoň 5 kusů, takže podstatné jméno stojí ve 2. pádě množného čísla.

interface Chyba { v: number; why: string }
interface Uloha {
  q: string;
  /** Klíč. U peněz v haléřích (`kc: true`), jinak celé číslo. */
  a: number;
  kc?: boolean;
  h0: string;
  h1: string;
  steps: string[];
  e: string;
  d: Chyba[];
}

/** Sčítání bez přenosu (v nejvyšším řádu se napíše celý součet). */
function bezPrenosu(a: number, b: number): number {
  let out = 0;
  for (let rad = 1; a > 0 || b > 0; rad *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) {
    const s = (a % 10) + (b % 10);
    out += (a < 10 && b < 10 ? s : s % 10) * rad;
  }
  return out;
}

/** Odčítání „menší číslici od větší" v každém řádu. */
function mensiOdVetsi(a: number, b: number): number {
  let out = 0;
  for (let rad = 1; a > 0 || b > 0; rad *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) {
    out += Math.abs((a % 10) - (b % 10)) * rad;
  }
  return out;
}

/** Násobení dvojciferným činitelem s neposunutým druhým mezisoučtem. */
const neposunuty = (n: number, k: number) => n * (k % 10) + n * Math.floor(k / 10);

/** Haléře → „42,90". */
const kc = (h: number) => fkc(h / 100);

const PRENOS = "Při sčítání pod sebou se zapomněl přenos: když součet v řádu přesáhne 9, desítka se přičte k vyššímu řádu.";
const VYPUJCKA = "V některém řádu se odečetla menší číslice od větší. Když je nahoře menší číslice, musíš si půjčit 1 z vyššího řádu.";

// ── L1: jeden krok, vybrat operaci ─────────────────────────────────────────

function hrad(): Uloha {
  const a = rnd(18000, 85000), b = rnd(1200, 9500);
  const x = a + b;
  return {
    q: `Hrad navštívilo v červenci ${fmt(a)} lidí. V srpnu ho navštívilo o ${fmt(b)} lidí víc. Kolik lidí navštívilo hrad v srpnu?`,
    a: x,
    h0: "V srpnu přišlo víc lidí, nebo méně než v červenci? Podle toho vyber početní operaci.",
    h1: `„O ${fmt(b)} víc" znamená, že k červencovému počtu ${fmt(a)} přičteš ${fmt(b)}. Čísla napiš pod sebe, jednotky pod jednotky, a hlídej přenos.`,
    steps: [`V srpnu o ${fmt(b)} víc → sčítám.`, `${fmt(a)} + ${fmt(b)} = ${fmt(x)}`],
    e: `„O … víc" znamená přičíst: ${fmt(a)} + ${fmt(b)} = ${fmt(x)}. V srpnu hrad navštívilo ${fmt(x)} lidí.`,
    d: [
      { v: a - b, why: "„O … víc“ se přečetlo jako „o … míň“. V srpnu přišlo víc lidí než v červenci, proto se přičítá." },
      { v: bezPrenosu(a, b), why: PRENOS },
      { v: a + x, why: "To jsou návštěvníci za červenec a srpen dohromady. Otázka se ptá jen na srpen." },
    ],
  };
}

const PECIVO = [
  { gen: "rohlíků", kde: "Pekárna upeče" },
  { gen: "housek", kde: "Pekárna upeče" },
  { gen: "jogurtů", kde: "Mlékárna naplní" },
  { gen: "lahví", kde: "Stáčírna naplní" },
];

function pekarna(): Uloha {
  const n = rnd(1050, 2950), d = rnd(12, 29);
  if (d % 10 === 0) return pekarna();
  const x = n * d;
  const p = pick(PECIVO);
  return {
    q: `${p.kde} každý den ${fmt(n)} ${p.gen}. Kolik ${p.gen} to bude za ${d} dní?`,
    a: x,
    h0: `Každý den je to stejný počet, ${fmt(n)} ${p.gen}. Kolikrát se to opakuje?`,
    h1: `${d} dní po ${fmt(n)} je násobení ${fmt(n)} · ${d}. Nejdřív násob jednotkami, pak desítkami a druhý mezisoučet napiš o jedno místo doleva.`,
    steps: [`${d} dní po ${fmt(n)} → násobím.`, `${fmt(n)} · ${d % 10} = ${fmt(n * (d % 10))}`, `${fmt(n)} · ${Math.floor(d / 10)}0 = ${fmt(n * Math.floor(d / 10) * 10)}`, `${fmt(n * (d % 10))} + ${fmt(n * Math.floor(d / 10) * 10)} = ${fmt(x)}`],
    e: `Stejné množství ${d}krát za sebou je násobení: ${fmt(n)} · ${d} = ${fmt(x)} ${p.gen}.`,
    d: [
      { v: n + d, why: "Denní počet a počet dní se sečetly. Když se stejné množství opakuje, násobí se." },
      { v: neposunuty(n, d), why: "Druhý mezisoučet se nepsal o místo doleva. Násobíš desítkami, proto patří o řád výš." },
      { v: x - n, why: `To je jen ${d - 1} dní, jeden den se nezapočítal.` },
    ],
  };
}

function prepravky(): Uloha {
  const d = rnd(12, 48), q = rnd(12, 64);
  if (d % 10 === 0 || d === q) return prepravky();
  const n = d * q;
  return {
    q: `Do obchodu přivezli ${fmt(n)} ${plural(n, "láhev", "láhve", "lahví")} minerálky v ${d} stejných přepravkách. Kolik lahví je v jedné přepravce?`,
    a: q,
    h0: `Všechny láhve jsou rozdělené do ${d} stejných přepravek. Kterou operací zjistíš, kolik je v jedné?`,
    h1: `Rozdělit na stejné díly znamená dělit: ${fmt(n)} : ${d}. Odhadni, kolikrát se ${d} vejde do prvních číslic, a výsledek ověř násobením.`,
    steps: [`Rozděleno do ${d} stejných přepravek → dělím.`, `${fmt(n)} : ${d} = ${q}`, `Zkouška: ${q} · ${d} = ${fmt(n)}`],
    e: `Láhve jsou rozdělené na ${d} stejných dílů, proto dělíme: ${fmt(n)} : ${d} = ${q}. Zkouška: ${q} · ${d} = ${fmt(n)}.`,
    d: [
      { v: n - d, why: "Od počtu lahví se odečetl počet přepravek. Rozdělit na stejné díly ale znamená dělit." },
      { v: q + 1, why: `Zkouška: ${q + 1} · ${d} = ${fmt((q + 1) * d)}, to je víc lahví, než přivezli.` },
      { v: q - 1, why: `Zkouška: ${q - 1} · ${d} = ${fmt((q - 1) * d)}, pár lahví by zbylo mimo přepravky.` },
    ],
  };
}

function letadlo(): Uloha {
  const a = rnd(9000, 12500), b = rnd(2500, 8200);
  const x = a - b;
  return {
    q: `Letadlo letělo ve výšce ${fmt(a)} m. Před přistáním kleslo do výšky ${fmt(b)} m. O kolik metrů kleslo?`,
    a: x,
    h0: "Hledáš, o kolik je jedno číslo větší než druhé. Jakou operací zjistíš rozdíl?",
    h1: `Rozdíl zjistíš odčítáním: od větší výšky ${fmt(a)} m odečti menší ${fmt(b)} m. Pozor na půjčování z vyššího řádu.`,
    steps: [`O kolik kleslo = původní výška − nová výška.`, `${fmt(a)} − ${fmt(b)} = ${fmt(x)}`],
    e: `Letadlo kleslo o rozdíl obou výšek: ${fmt(a)} − ${fmt(b)} = ${fmt(x)} m. Zkouška: ${fmt(b)} + ${fmt(x)} = ${fmt(a)}.`,
    d: [
      { v: a + b, why: "Obě výšky se sečetly. O kolik se něco změnilo, zjistíš rozdílem, tedy odčítáním." },
      { v: mensiOdVetsi(a, b), why: VYPUJCKA },
      { v: b, why: `${fmt(b)} m je nová výška letadla, ne to, o kolik kleslo.` },
    ],
  };
}

const ZBOZI: [string, string][] = [
  ["chleba", "sýr"], ["sešit", "pravítko"], ["mléko", "máslo"], ["pastelky", "lepidlo"], ["šampon", "mýdlo"], ["jablka", "hrušky"],
];

function nakup(): Uloha {
  const [z1, z2] = pick(ZBOZI);
  // ceny v haléřích, haléře vždy s přechodem přes celou korunu (součet haléřů ≥ 100)
  const h1 = rnd(3, 9) * 10, h2 = rnd(11 - h1 / 10, 9) * 10;
  const a = rnd(15, 79) * 100 + h1, b = rnd(12, 69) * 100 + h2;
  const x = a + b;
  return {
    q: `Maminka koupila ${z1} za ${kc(a)} Kč a ${z2} za ${kc(b)} Kč. Kolik korun zaplatila?`,
    a: x,
    kc: true,
    h0: "Za nákup se platí obě věci dohromady. Jakou operací zjistíš celkovou cenu?",
    h1: `Sečti ${kc(a)} + ${kc(b)} pod sebou tak, aby desetinná čárka byla pod desetinnou čárkou. Když haléře dají dohromady víc než 99, přenes 1 korunu.`,
    steps: [`Celkem = cena první věci + cena druhé.`, `${kc(a)} + ${kc(b)} = ${kc(x)}`],
    e: `Obě ceny sečteme, čárka pod čárkou: ${kc(a)} + ${kc(b)} = ${kc(x)} Kč. Haléře dají ${(h1 + h2)} haléřů, tedy 1 korunu a ${h1 + h2 - 100} haléřů.`,
    d: [
      { v: x - 100, why: "Haléře dohromady přesáhly 99, ale přenos 1 koruny přes desetinnou čárku se zapomněl." },
      { v: Math.abs(a - b), why: "Ceny se odečetly. Za nákup se ale platí obě věci dohromady." },
      { v: x + 1000, why: "Výsledek je o 10 Kč větší. Zkontroluj řád desítek korun." },
    ],
  };
}

// ── L2: dva kroky ──────────────────────────────────────────────────────────

function vylet(): Uloha {
  const z = rnd(21, 29), c = rnd(15, 26) * 10 + pick([0, 5]);
  const vybrano = z * c;
  const bus = Math.round((vybrano * (rnd(40, 65) / 100)) / 100) * 100;
  const x = vybrano - bus;
  return {
    q: `Na výlet jede ${z} žáků a každý zaplatí ${c} Kč. Autobus stojí ${fmt(bus)} Kč a zbytek peněz půjde na vstupné. Kolik korun zbude na vstupné?`,
    a: x,
    h0: "Nejdřív zjisti, kolik peněz třída vybere celkem. Teprve potom můžeš zaplatit autobus.",
    h1: `Vybraná částka je ${c} · ${z}. Od ní pak odečti cenu autobusu ${fmt(bus)} Kč.`,
    steps: [`Vybráno: ${c} · ${z} = ${fmt(vybrano)}`, `Na vstupné: ${fmt(vybrano)} − ${fmt(bus)} = ${fmt(x)}`],
    e: `${z} žáků po ${c} Kč vybere ${c} · ${z} = ${fmt(vybrano)} Kč. Po zaplacení autobusu zbude ${fmt(vybrano)} − ${fmt(bus)} = ${fmt(x)} Kč.`,
    d: [
      { v: vybrano, why: `${fmt(vybrano)} Kč třída vybere celkem. Ještě je potřeba zaplatit autobus.` },
      { v: vybrano + bus, why: "Cena autobusu se přičetla. Autobus se z vybraných peněz platí, takže se odečítá." },
      { v: mensiOdVetsi(vybrano, bus), why: VYPUJCKA },
      { v: x + 100, why: "Výsledek je o 100 větší. Zkontroluj řád stovek." },
    ],
  };
}

const BALENI = [
  { one: "Jeden jogurt stojí", gen: "jogurtů", c: [12, 24] },
  { one: "Jedna plechovka limonády stojí", gen: "plechovek limonády", c: [15, 29] },
  { one: "Jedna tužka stojí", gen: "tužek", c: [9, 19] },
  { one: "Jeden rohlík stojí", gen: "rohlíků", c: [3, 6] },
];

function baleni(): Uloha {
  const b = pick(BALENI);
  const c = rnd(b.c[0], b.c[1]), k = pick([6, 8, 10, 12, 16, 20, 24]);
  const jednotlive = k * c;
  const s = rnd(5, Math.max(6, Math.floor(jednotlive * 0.25)));
  const cena = jednotlive - s;
  return {
    q: `${b.one} ${c} Kč. Balení ${k} ${b.gen} stojí ${fmt(cena)} Kč. Kolik korun ušetříš, když koupíš balení, a ne ${k} ${b.gen} jednotlivě?`,
    a: s,
    h0: `Nejdřív zjisti, kolik by stálo ${k} ${b.gen} kupovaných po jednom. Pak to porovnej s cenou balení.`,
    h1: `Jednotlivě: ${c} · ${k}. Úspora je rozdíl mezi touto cenou a cenou balení ${fmt(cena)} Kč.`,
    steps: [`Jednotlivě: ${c} · ${k} = ${fmt(jednotlive)}`, `Úspora: ${fmt(jednotlive)} − ${fmt(cena)} = ${s}`],
    e: `${k} ${b.gen} po ${c} Kč stojí ${c} · ${k} = ${fmt(jednotlive)} Kč. Balení stojí ${fmt(cena)} Kč, ušetříš ${fmt(jednotlive)} − ${fmt(cena)} = ${s} Kč.`,
    d: [
      { v: jednotlive, why: `${fmt(jednotlive)} Kč je cena ${k} ${b.gen} kupovaných jednotlivě. Úspora je rozdíl proti balení.` },
      { v: cena, why: `${fmt(cena)} Kč je cena balení. Otázka se ptá, o kolik je balení levnější.` },
      { v: jednotlive + cena, why: "Obě ceny se sečetly. Úsporu zjistíš rozdílem." },
    ],
  };
}

function vlak(): Uloha {
  const v = rnd(65, 115), h = rnd(3, 8), zbytek = rnd(45, 380);
  const ujel = v * h, D = ujel + zbytek;
  return {
    q: `Cesta vlakem měří ${fmt(D)} km. Vlak ujede za hodinu ${v} km. Kolik kilometrů mu zbývá do cíle po ${h} hodinách jízdy?`,
    a: zbytek,
    h0: "Nejdřív zjisti, kolik kilometrů vlak už ujel. Pak zjistíš, kolik zbývá.",
    h1: `Za ${h} ${plural(h, "hodinu", "hodiny", "hodin")} po ${v} km ujede ${v} · ${h} km. Tuto vzdálenost odečti od celé cesty ${fmt(D)} km.`,
    steps: [`Ujel: ${v} · ${h} = ${fmt(ujel)}`, `Zbývá: ${fmt(D)} − ${fmt(ujel)} = ${zbytek}`],
    e: `Za ${h} ${plural(h, "hodinu", "hodiny", "hodin")} vlak ujede ${v} · ${h} = ${fmt(ujel)} km. Do cíle zbývá ${fmt(D)} − ${fmt(ujel)} = ${zbytek} km.`,
    d: [
      { v: ujel, why: `${fmt(ujel)} km vlak už ujel. Otázka se ptá, kolik mu ještě zbývá.` },
      { v: D - v, why: "Odečetla se jen jedna hodina jízdy. Vlak jel víc hodin." },
      { v: D + ujel, why: "Ujetá vzdálenost se přičetla. Co vlak ujel, už mu nezbývá, proto se odečítá." },
    ],
  };
}

function vraceni(): Uloha {
  const [z1, z2] = pick(ZBOZI);
  const a = rnd(12, 69) * 100 + rnd(1, 9) * 10, b = rnd(8, 49) * 100 + rnd(1, 9) * 10;
  const suma = a + b;
  const platba = [10000, 20000, 50000].find((p) => p > suma)!;
  const x = platba - suma;
  if (x % 100 === 0) return vraceni();
  return {
    q: `Tomáš koupil ${z1} za ${kc(a)} Kč a ${z2} za ${kc(b)} Kč. Platil bankovkou ${fmt(platba / 100)} Kč. Kolik korun mu vrátili?`,
    a: x,
    kc: true,
    h0: "Nejdřív zjisti, kolik stál celý nákup. Až potom spočítáš, kolik se vrací.",
    h1: `Sečti ${kc(a)} + ${kc(b)}, čárku pod čárku. Výsledek odečti od ${fmt(platba / 100)} Kč; napiš si ${fmt(platba / 100)},00, ať máš haléře pod haléři.`,
    steps: [`Nákup: ${kc(a)} + ${kc(b)} = ${kc(suma)}`, `Vráceno: ${fmt(platba / 100)},00 − ${kc(suma)} = ${kc(x)}`],
    e: `Nákup stál ${kc(a)} + ${kc(b)} = ${kc(suma)} Kč. Z ${fmt(platba / 100)} Kč se vrací ${fmt(platba / 100)},00 − ${kc(suma)} = ${kc(x)} Kč.`,
    d: [
      { v: suma, why: `${kc(suma)} Kč stál nákup. Otázka se ptá, kolik se vrátilo z ${fmt(platba / 100)} Kč.` },
      { v: platba - a, why: `Odečetla se jen cena za ${z1}. Tomáš platil obě věci.` },
      { v: x + 100, why: "Při odčítání haléřů sis půjčil 1 korunu, ale v korunách jsi ji pak neubral." },
    ],
  };
}

const DNY_PRUMER = [
  { kde: "Hrad navštívilo", co: "lidí", jak: "navštívilo hrad", musi: "musí hrad navštívit" },
  { kde: "Pekárna prodala", co: "rohlíků", jak: "pekárna prodala", musi: "musí pekárna prodat" },
  { kde: "Knihovna půjčila", co: "knih", jak: "knihovna půjčila", musi: "musí knihovna půjčit" },
];

function prumer(): Uloha {
  const t = pick(DNY_PRUMER);
  const p = rnd(60, 190) * 10;
  const d1 = rnd(-250, 250), d2 = rnd(-250, 250);
  const vals = [p + d1, p + d2, p - d1 - d2];
  if (new Set(vals).size < 3 || vals.includes(p) || vals.some((v) => v < 300)) return prumer();
  const sum = vals[0] + vals[1] + vals[2];
  const med = [...vals].sort((u, w) => u - w)[1];
  return {
    q: `${t.kde} v pátek ${fmt(vals[0])} ${t.co}, v sobotu ${fmt(vals[1])} a v neděli ${fmt(vals[2])}. Kolik ${t.co} ${t.jak} průměrně za jeden den?`,
    a: p,
    h0: "Průměr zjistíš ve dvou krocích: nejdřív všechno sečti, pak to rozděl rovným dílem na jednotlivé dny.",
    h1: `Sečti všechny tři dny: ${fmt(vals[0])} + ${fmt(vals[1])} + ${fmt(vals[2])}. Součet vyděl počtem dní, tedy 3.`,
    steps: [`Součet: ${fmt(vals[0])} + ${fmt(vals[1])} + ${fmt(vals[2])} = ${fmt(sum)}`, `Průměr: ${fmt(sum)} : 3 = ${fmt(p)}`],
    e: `Za tři dny je to ${fmt(vals[0])} + ${fmt(vals[1])} + ${fmt(vals[2])} = ${fmt(sum)}. Rozděleno na 3 dny: ${fmt(sum)} : 3 = ${fmt(p)} ${t.co} za den.`,
    d: [
      { v: sum, why: `${fmt(sum)} je součet za všechny tři dny. Průměr dostaneš, až ho vydělíš počtem dní.` },
      ...(sum % 2 === 0 ? [{ v: sum / 2, why: "Součet se vydělil 2. Dny jsou ale tři, dělí se tedy 3." }] : []),
      { v: med, why: "To je prostřední z hodnot. Průměr se ale počítá ze součtu všech dní." },
      { v: p + 100, why: `Zkouška: ${fmt(p + 100)} · 3 = ${fmt((p + 100) * 3)}, to není součet ${fmt(sum)}.` },
    ],
  };
}

// ── L3: přenos ─────────────────────────────────────────────────────────────

interface Osoba { n: string; acc: string; zena: boolean }
const DVOJICE: [Osoba, Osoba][] = [
  [{ n: "Petr", acc: "Petra", zena: false }, { n: "Pavel", acc: "Pavla", zena: false }],
  [{ n: "Eva", acc: "Evu", zena: true }, { n: "Klára", acc: "Kláru", zena: true }],
  [{ n: "Adam", acc: "Adama", zena: false }, { n: "Tomáš", acc: "Tomáše", zena: false }],
  [{ n: "Lucie", acc: "Lucii", zena: true }, { n: "Tereza", acc: "Terezu", zena: true }],
];

function soucetRozdil(): Uloha {
  const [s1, s2] = pick(DVOJICE);
  const mensi = rnd(30, 200) * 10, D = rnd(12, 90) * 10;
  const vetsi = mensi + D, S = vetsi + mensi;
  return {
    q: `${s1.n} a ${s2.n} mají dohromady ${fmt(S)} Kč. ${s1.n} má o ${fmt(D)} Kč víc než ${s2.n}. Kolik korun má ${s1.n}?`,
    a: vetsi,
    h0: `Kdyby ${s1.n} ${s1.zena ? "neměla" : "neměl"} těch ${fmt(D)} Kč navíc, ${s1.zena ? "měly by obě" : "měli by oba"} stejně. Kolik by pak bylo dohromady?`,
    h1: `Od celkové částky odečti rozdíl: ${fmt(S)} − ${fmt(D)}. Zbytek rozděl na dvě stejné části, to má ${s2.n}. ${s1.n} má o ${fmt(D)} Kč víc.`,
    steps: [`Bez rozdílu: ${fmt(S)} − ${fmt(D)} = ${fmt(S - D)}`, `Na každého stejně: ${fmt(S - D)} : 2 = ${fmt(mensi)} (${s2.n})`, `${s1.n}: ${fmt(mensi)} + ${fmt(D)} = ${fmt(vetsi)}`, `Zkouška: ${fmt(vetsi)} + ${fmt(mensi)} = ${fmt(S)}`],
    e: `Po odečtení rozdílu by ${s1.zena ? "obě měly" : "oba měli"} stejně: (${fmt(S)} − ${fmt(D)}) : 2 = ${fmt(mensi)} Kč, to má ${s2.n}. ${s1.n} má o ${fmt(D)} Kč víc, tedy ${fmt(vetsi)} Kč. Zkouška: ${fmt(vetsi)} + ${fmt(mensi)} = ${fmt(S)}.`,
    d: [
      { v: S / 2, why: `Celá částka se rozdělila napůl. To by platilo, kdyby ${s1.zena ? "měly obě" : "měli oba"} stejně, ale ${s1.n} má o ${fmt(D)} Kč víc.` },
      { v: mensi, why: `Tolik má ${s2.n}. Otázka se ptá na ${s1.acc}, ${s1.zena ? "která" : "který"} má víc.` },
      { v: S - D, why: `${fmt(S - D)} je součet dvou stejných částí. Ještě ho rozděl na dvě a přičti rozdíl.` },
    ],
  };
}

function myslimCislo(): Uloha {
  const m = rnd(12, 35), x = rnd(24, 95), j = rnd(3, 12);
  if (m % 10 === 0) return myslimCislo();
  const p = m * j, R = x * m + p;
  return {
    q: `Myslím si číslo. Vynásobím ho ${m} a k výsledku přičtu ${p}. Vyjde mi ${fmt(R)}. Jaké číslo si myslím?`,
    a: x,
    h0: "Počítej pozpátku: začni od výsledku a každý krok obrať. Co bylo provedeno jako poslední?",
    h1: `Poslední bylo přičtení ${p}, obrať ho odečtením: ${fmt(R)} − ${p}. Pak obrať násobení ${m} dělením.`,
    steps: [`Obrácené přičtení: ${fmt(R)} − ${p} = ${fmt(R - p)}`, `Obrácené násobení: ${fmt(R - p)} : ${m} = ${x}`, `Zkouška: ${x} · ${m} + ${p} = ${fmt(R)}`],
    e: `Pozpátku se kroky obracejí v opačném pořadí: ${fmt(R)} − ${p} = ${fmt(R - p)}, pak ${fmt(R - p)} : ${m} = ${x}. Zkouška: ${x} · ${m} = ${fmt(x * m)}, ${fmt(x * m)} + ${p} = ${fmt(R)}.`,
    d: [
      { v: R / m, why: `Výsledek se jen vydělil ${m}. Nejdřív je ale potřeba obrátit přičtení, tedy odečíst ${p}.` },
      { v: (R + p) / m, why: `Číslo ${p} se přičetlo znovu. Pozpátku se přičtení obrací odečtením.` },
      { v: R - p, why: `Tady se obrátilo jen přičtení. Ještě je potřeba obrátit násobení ${m} dělením.` },
    ],
  };
}

const KUSY = [
  { gen: "sešitů", jaky: "stejných sešitů", c: [18, 45] },
  { gen: "tužek", jaky: "stejných tužek", c: [9, 28] },
  { gen: "vstupenek", jaky: "stejných vstupenek", c: [55, 190] },
  { gen: "květináčů", jaky: "stejných květináčů", c: [35, 120] },
];

function trojclenka(): Uloha {
  const k = pick(KUSY);
  const c1 = rnd(k.c[0], k.c[1]), n1 = rnd(5, 9), n2 = rnd(12, 35);
  if (n2 % n1 === 0 || c1 === n2) return trojclenka();
  const C = c1 * n1, x = c1 * n2;
  return {
    q: `${n1} ${k.jaky} stojí ${fmt(C)} Kč. Kolik korun stojí ${n2} takových ${k.gen}?`,
    a: x,
    h0: "Když znáš cenu jednoho kusu, spočítáš cenu libovolného počtu. Jak zjistíš cenu jednoho?",
    h1: `Cenu jednoho kusu zjistíš dělením ${fmt(C)} : ${n1}. Tu pak vynásob ${n2}.`,
    steps: [`Jeden kus: ${fmt(C)} : ${n1} = ${c1}`, `${n2} kusů: ${c1} · ${n2} = ${fmt(x)}`],
    e: `Jeden kus stojí ${fmt(C)} : ${n1} = ${c1} Kč. ${n2} kusů stojí ${c1} · ${n2} = ${fmt(x)} Kč.`,
    d: [
      { v: C + (n2 - n1), why: `Přičetl se jen rozdíl počtu kusů (${n2 - n1}). Každý kus navíc ale stojí ${c1} Kč, ne 1 Kč.` },
      { v: C * n2, why: `Cena ${n1} kusů se vynásobila ${n2}. Násobit se má cena jednoho kusu.` },
      { v: c1, why: `${c1} Kč stojí jeden kus. Tuto cenu ještě vynásob ${n2}.` },
    ],
  };
}

function rozpocet(): Uloha {
  const a = rnd(6, 15), p = rnd(29, 69) * 10, b = rnd(10, 25), q = rnd(9, 19) * 10 - 5;
  const naklad = a * p + b * q;
  const B = (Math.ceil(naklad / 1000) + rnd(1, 4)) * 1000;
  const x = B - naklad;
  return {
    q: `Škola má na nákup sportovních potřeb ${fmt(B)} Kč. Koupí ${a} ${plural(a, "míč", "míče", "míčů")} po ${p} Kč a ${b} ${plural(b, "švihadlo", "švihadla", "švihadel")} po ${q} Kč. Kolik korun zbude?`,
    a: x,
    h0: "Zjisti zvlášť, kolik stojí míče a kolik švihadla. Pak spočítej, kolik stojí celý nákup.",
    h1: `Míče: ${p} · ${a}, švihadla: ${q} · ${b}. Obě částky sečti a součet odečti od ${fmt(B)} Kč.`,
    steps: [`Míče: ${p} · ${a} = ${fmt(a * p)}`, `Švihadla: ${q} · ${b} = ${fmt(b * q)}`, `Nákup: ${fmt(a * p)} + ${fmt(b * q)} = ${fmt(naklad)}`, `Zbude: ${fmt(B)} − ${fmt(naklad)} = ${fmt(x)}`],
    e: `Míče stojí ${fmt(a * p)} Kč, švihadla ${fmt(b * q)} Kč, dohromady ${fmt(naklad)} Kč. Zbude ${fmt(B)} − ${fmt(naklad)} = ${fmt(x)} Kč.`,
    d: [
      { v: naklad, why: `${fmt(naklad)} Kč stojí celý nákup. Otázka se ptá, kolik zbude z ${fmt(B)} Kč.` },
      { v: B - a * p, why: "Zaplatily se jen míče. Škola kupuje i švihadla." },
      { v: B - a * p - q, why: `Švihadel je ${b}, ne jedno. Jejich cenu je potřeba vynásobit ${b}.` },
    ],
  };
}

function chybejici(): Uloha {
  const t = pick(DNY_PRUMER);
  const p = rnd(80, 160) * 10;
  const vals = [p + rnd(-300, 300), p + rnd(-300, 300), p + rnd(-300, 300)];
  const sum = vals[0] + vals[1] + vals[2];
  const x = 4 * p - sum;
  if (x < 300 || vals.includes(x) || x === p || new Set(vals).size < 3) return chybejici();
  return {
    q: `${t.kde} ve čtvrtek ${fmt(vals[0])} ${t.co}, v pátek ${fmt(vals[1])} a v sobotu ${fmt(vals[2])}. Kolik ${t.co} ${t.musi} v neděli, aby průměr za čtyři dny byl ${fmt(p)} za den?`,
    a: x,
    h0: "Průměr krát počet dní dá součet za všechny dny. Kolik má být součet za čtyři dny?",
    h1: `Za čtyři dny má být ${fmt(p)} · 4. Od toho odečti, kolik už bylo za čtvrtek, pátek a sobotu.`,
    steps: [`Součet za 4 dny: ${fmt(p)} · 4 = ${fmt(4 * p)}`, `Za 3 dny už: ${fmt(vals[0])} + ${fmt(vals[1])} + ${fmt(vals[2])} = ${fmt(sum)}`, `Neděle: ${fmt(4 * p)} − ${fmt(sum)} = ${fmt(x)}`],
    e: `Průměr ${fmt(p)} za 4 dny znamená součet ${fmt(p)} · 4 = ${fmt(4 * p)}. Za tři dny už je ${fmt(sum)}, na neděli zbývá ${fmt(4 * p)} − ${fmt(sum)} = ${fmt(x)}.`,
    d: [
      { v: p, why: `${fmt(p)} je průměr, ne neděle. Nedělní počet musí vyrovnat, o kolik se ostatní dny od průměru liší.` },
      { v: 4 * p, why: `${fmt(4 * p)} je potřebný součet za všechny čtyři dny. Ještě odečti, kolik už bylo.` },
      { v: sum, why: `${fmt(sum)} je součet za čtvrtek, pátek a sobotu. Neděle je to, co do ${fmt(4 * p)} chybí.` },
    ],
  };
}

const SABLONY: Record<1 | 2 | 3, (() => Uloha)[]> = {
  1: [hrad, pekarna, prepravky, letadlo, nakup],
  2: [vylet, baleni, vlak, vraceni, prumer],
  3: [soucetRozdil, myslimCislo, trojclenka, rozpocet, chybejici],
};

/** Čísla v textu tak, jak je dítě čte: „1 245", „42,90". */
export const CISLO_RE = /\d{1,3}(?:[  ]\d{3})*(?:,\d+)?/g;

function sestav(u: Uloha): PracticeTask | null {
  const f = (n: number) => (u.kc ? kc(n) : fmt(n));
  const key = f(u.a);
  const vText: string[] = [u.q, u.h0, u.h1].flatMap((s) => s.match(CISLO_RE) ?? []);
  if (vText.includes(key)) return null;
  const seen = new Set([key]);
  const vybrane: { value: string; why: string }[] = [];
  for (const c of u.d) {
    if (!Number.isFinite(c.v) || c.v <= 0 || !Number.isInteger(c.v)) continue;
    const v = f(c.v);
    if (seen.has(v)) continue;
    seen.add(v);
    vybrane.push({ value: v, why: c.why });
    if (vybrane.length === 3) break;
  }
  if (vybrane.length < 3) return null;
  const optionFeedback: Record<string, string> = {};
  for (const c of vybrane) optionFeedback[c.value] = c.why;
  return {
    question: u.q,
    correctAnswer: key,
    options: shuffle([key, ...vybrane.map((c) => c.value)]),
    optionFeedback,
    hints: [u.h0, u.h1],
    solutionSteps: u.steps,
    explanation: u.e,
  };
}

function gen(level: number): PracticeTask[] {
  const lv = (level <= 1 ? 1 : level >= 3 ? 3 : 2) as 1 | 2 | 3;
  const sablony = SABLONY[lv];
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 400 && out.size < 30; i++) {
    const t = sestav(sablony[i % sablony.length]());
    if (t && !out.has(t.question)) out.set(t.question, t);
  }
  return shuffle([...out.values()]);
}

export const SLOVNI_ULOHY_VELKA_A_DESETINNA_CISLA: TopicMetadata[] = [
  {
    id: "g5-mat-slovni-ulohy-5",
    // RVP dataset nemá pro 5. ročník uzel se slovními úlohami (stejně jako
    // pro 4.); `rvp_data.json` je jen ke čtení. `rvpNodeId` = vlastní ID,
    // dokud uzel v datasetu nevznikne. Viz docs/PENDING_CHANGES.md (2026-09-30 D).
    rvpNodeId: "g5-mat-slovni-ulohy-5",
    title: "Slovní úlohy s velkými a desetinnými čísly",
    studentTitle: "Příběhy ze života",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Z příběhu poznáš, co počítat, i když na to potřebuješ dva kroky.",
    keywords: ["slovní úlohy", "dvoukrokové úlohy", "průměr", "desetinná čísla", "koruny", "počítání pozpátku"],
    goals: [
      "Z příběhu poznat, kterou početní operaci použít, i u dvoukrokových úloh.",
      "Počítat s korunami a haléři (sčítání a odčítání desetinných čísel).",
      "Řešit úlohy pozpátku, na součet a rozdíl a přes cenu jednoho kusu.",
      "Ověřit výsledek zkouškou.",
    ],
    boundaries: ["Násobení a dělení nejvýš dvojciferným číslem.", "Desetinná čísla jen v penězích a jen sčítání a odčítání."],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív si řekni, na co se úloha ptá. Pak hledej, co k tomu potřebuješ vědět — někdy to musíš spočítat v mezikroku.",
      steps: [
        "Přečti si úlohu a najdi otázku.",
        "Rozmysli, co potřebuješ znát, abys na ni odpověděl/a. Chybí-li to, spočítej to jako první krok.",
        "Spočítej to pod sebou; u korun piš čárku pod čárku.",
        "Udělej zkoušku: dosaď výsledek zpátky do příběhu.",
      ],
      commonMistake: "Odpovědět mezivýsledkem. Když spočítáš, kolik stál nákup, ještě to není odpověď na otázku, kolik ti vrátili.",
      example: "6 stejných sešitů stojí 162 Kč. Kolik stojí 15 sešitů? Jeden: 162 : 6 = 27 Kč. Patnáct: 27 · 15 = 405 Kč.",
    },
  },
];
