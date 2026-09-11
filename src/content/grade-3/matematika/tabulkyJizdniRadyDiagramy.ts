import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "../_shared";

/**
 * Přepsáno 2026-09-11 (inventura obsahu). Každá úloha měla jen jednu šablonovou
 * nápovědu a žádnou zpětnou vazbu; nápověda u celkové doby jízdy radila
 * „Sečti čas odjezdu…“, přitom dobu jízdy dostaneš ODČÍTÁNÍM časů.
 *
 * Teď pevné banky (ručně napsané tabulky, jízdní řády a kroužkové diagramy):
 *   L1 — přímé čtení: hodnota v tabulce, čas odjezdu, nejvíc/nejméně,
 *        počet kroužků v diagramu (● = 1).
 *   L2 — jedna početní operace: součet dvou řádků, „o kolik víc“, doba jízdy
 *        mezi zastávkami v téže hodině, diagram s měřítkem (● = 2, ● = 5).
 *   L3 — dva kroky: doba jízdy přes celou hodinu, zpoždění, porovnání součtů,
 *        součet celé tabulky, rozdíl v diagramu s měřítkem.
 * Řádky začínají „•“ — i když se zalomení řádků v zobrazení slije, zůstane
 * tabulka čitelná („• Lvi: 6 • Sloni: 4 …“).
 */

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Tři různé chybné možnosti, odlišné od klíče (dedup až po vygenerování). */
function tri(correct: string, kandidati: Distractor[]): [Distractor, Distractor, Distractor] {
  const seen = new Set([correct]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    if (seen.has(k.value) || k.value.startsWith("-")) continue;
    seen.add(k.value);
    out.push(k);
    if (out.length === 3) return out as [Distractor, Distractor, Distractor];
  }
  throw new Error(`Málo chybných možností pro klíč ${correct}`);
}

// ── Tabulky s počty ─────────────────────────────────────────────────────────

interface Radek { label: string; tvar: string; v: number }

interface Tabulka {
  nazev: string;
  radky: Radek[];
  kolik: (t: string) => string;
  dohromady: (x: string, y: string) => string;
  oKolik: (x: string, y: string) => string;
  extremy?: { nejvic: string; nejmin: string };
}

const ZOO: Tabulka = {
  nazev: "Zvířata v zoo",
  radky: [
    { label: "Lvi", tvar: "lvů", v: 6 }, { label: "Sloni", tvar: "slonů", v: 4 },
    { label: "Zebry", tvar: "zeber", v: 13 }, { label: "Tučňáci", tvar: "tučňáků", v: 17 },
  ],
  kolik: (t) => `Kolik ${t} je v zoo?`,
  dohromady: (x, y) => `Kolik ${x} a ${y} je v zoo dohromady?`,
  oKolik: (x, y) => `O kolik víc ${x} než ${y} je v zoo?`,
  extremy: { nejvic: "Kterých zvířat je v zoo nejvíc?", nejmin: "Kterých zvířat je v zoo nejméně?" },
};

const ZMRZLINY: Tabulka = {
  nazev: "Prodané zmrzliny",
  radky: [
    { label: "Pondělí", tvar: "v pondělí", v: 23 }, { label: "Úterý", tvar: "v úterý", v: 18 },
    { label: "Středa", tvar: "ve středu", v: 31 }, { label: "Čtvrtek", tvar: "ve čtvrtek", v: 26 },
  ],
  kolik: (t) => `Kolik zmrzlin se prodalo ${t}?`,
  dohromady: (x, y) => `Kolik zmrzlin se prodalo ${x} a ${y} dohromady?`,
  oKolik: (x, y) => `O kolik víc zmrzlin se prodalo ${x} než ${y}?`,
  extremy: { nejvic: "Kdy se prodalo nejvíc zmrzlin?", nejmin: "Kdy se prodalo nejméně zmrzlin?" },
};

const KNIHY: Tabulka = {
  nazev: "Vypůjčené knihy ve školní knihovně",
  radky: [
    { label: "Leden", tvar: "v lednu", v: 42 }, { label: "Únor", tvar: "v únoru", v: 35 },
    { label: "Březen", tvar: "v březnu", v: 57 }, { label: "Duben", tvar: "v dubnu", v: 48 },
  ],
  kolik: (t) => `Kolik knih si děti půjčily ${t}?`,
  dohromady: (x, y) => `Kolik knih si děti půjčily ${x} a ${y} dohromady?`,
  oKolik: (x, y) => `O kolik víc knih si děti půjčily ${x} než ${y}?`,
  extremy: { nejvic: "Ve kterém měsíci si děti půjčily nejvíc knih?", nejmin: "Ve kterém měsíci si děti půjčily nejméně knih?" },
};

const BODY: Tabulka = {
  nazev: "Body v soutěži",
  radky: [
    { label: "Sovy", tvar: "Sovy", v: 64 }, { label: "Lišky", tvar: "Lišky", v: 81 },
    { label: "Orli", tvar: "Orli", v: 59 }, { label: "Vlci", tvar: "Vlci", v: 76 },
  ],
  kolik: (t) => `Kolik bodů získal tým ${t}?`,
  dohromady: (x, y) => `Kolik bodů získaly týmy ${x} a ${y} dohromady?`,
  oKolik: (x, y) => `O kolik bodů víc získal tým ${x} než tým ${y}?`,
};

const PAPIR: Tabulka = {
  nazev: "Sběr papíru v kilogramech",
  radky: [
    { label: "3. A", tvar: "3. A", v: 125 }, { label: "3. B", tvar: "3. B", v: 98 },
    { label: "3. C", tvar: "3. C", v: 143 }, { label: "3. D", tvar: "3. D", v: 117 },
  ],
  kolik: (t) => `Kolik kilogramů papíru nasbírala třída ${t}?`,
  dohromady: (x, y) => `Kolik kilogramů papíru nasbíraly třídy ${x} a ${y} dohromady?`,
  oKolik: (x, y) => `O kolik kilogramů víc nasbírala třída ${x} než třída ${y}?`,
};

const HRAD: Tabulka = {
  nazev: "Návštěvníci hradu",
  radky: [
    { label: "Pátek", tvar: "v pátek", v: 186 }, { label: "Sobota", tvar: "v sobotu", v: 342 },
    { label: "Neděle", tvar: "v neděli", v: 395 }, { label: "Pondělí", tvar: "v pondělí", v: 57 },
  ],
  kolik: (t) => `Kolik návštěvníků přišlo na hrad ${t}?`,
  dohromady: (x, y) => `Kolik návštěvníků přišlo na hrad ${x} a ${y} dohromady?`,
  oKolik: (x, y) => `O kolik víc návštěvníků přišlo na hrad ${x} než ${y}?`,
};

const tabulkaText = (t: Tabulka) => `Tabulka „${t.nazev}“:\n${t.radky.map((r) => `• ${r.label}: ${r.v}`).join("\n")}`;

function cteni(t: Tabulka, i: number): PracticeTask {
  const r = t.radky[i];
  const d = t.radky.filter((_, k) => k !== i)
    .map((o) => ({ value: String(o.v), why: `${o.v} je číslo v řádku „${o.label}“. Hledáš řádek „${r.label}“.` }));
  return choice(`${tabulkaText(t)}\n\n${t.kolik(r.tvar)}`, String(r.v), tri(String(r.v), d), {
    hints: [
      `V tabulce „${t.nazev}“ najdi řádek „${r.label}“.`,
      `Jeď prstem shora dolů po řádcích tabulky „${t.nazev}“, dokud nenarazíš na „${r.label}“. Číslo za dvojtečkou v tomhle řádku je hledaná hodnota.`,
    ],
    explanation: `Otázka se ptá na řádek „${r.label}“. V něm stojí číslo ${r.v}, ostatní čísla patří k jiným řádkům.`,
  });
}

function extrem(t: Tabulka, max: boolean): PracticeTask {
  const vals = t.radky.map((r) => r.v);
  const target = max ? Math.max(...vals) : Math.min(...vals);
  const i = vals.indexOf(target);
  const d = t.radky.filter((_, k) => k !== i).map((o) => ({
    value: o.tvar,
    why: `U řádku „${o.label}“ je ${o.v}. V tabulce je ale ještě ${max ? "větší" : "menší"} číslo.`,
  }));
  return choice(`${tabulkaText(t)}\n\n${max ? t.extremy!.nejvic : t.extremy!.nejmin}`, t.radky[i].tvar, tri(t.radky[i].tvar, d), {
    hints: [
      `Porovnej všechna čtyři čísla v tabulce „${t.nazev}“. Které je ${max ? "největší" : "nejmenší"}?`,
      `Porovnávej čísla po dvou: nejdřív desítky, pak jednotky. ${max ? "Větší" : "Menší"} z dvojice porovnej s dalším číslem, až ti zůstane jediné. Pak se podívej, ke kterému řádku tabulky „${t.nazev}“ patří.`,
    ],
    explanation: `Čísla v tabulce jsou ${vals.join(", ")}. ${max ? "Největší" : "Nejmenší"} je ${target}, a to patří k řádku „${t.radky[i].label}“.`,
  });
}

function soucet(t: Tabulka, i: number, j: number): PracticeTask {
  const ri = t.radky[i], rj = t.radky[j];
  const a = ri.v, b = rj.v, s = a + b;
  const k = [0, 1, 2, 3].find((x) => x !== i && x !== j)!;
  const rk = t.radky[k];
  const prenos = (a % 10) + (b % 10) >= 10;
  const d: Distractor[] = [
    { value: String(Math.abs(a - b)), why: "Tohle je rozdíl. Slovo „dohromady“ znamená čísla sečíst." },
    { value: String(a + rk.v), why: `Tohle je součet s řádkem „${rk.label}“ místo „${rj.label}“.` },
    prenos
      ? { value: String(s - 10), why: `Jednotky ${a % 10} + ${b % 10} dají víc než 9. Přenesená desítka se ale nepřičetla.` }
      : { value: String(s + 10), why: `Chyba v desítkách: sečti znovu desítky čísel ${a} a ${b}.` },
    { value: String(s + 1), why: `Chyba v jednotkách: sečti znovu ${a % 10} + ${b % 10}.` },
  ];
  return choice(`${tabulkaText(t)}\n\n${t.dohromady(ri.tvar, rj.tvar)}`, String(s), tri(String(s), d), {
    hints: [
      `Kolik je u „${ri.label}“ a kolik u „${rj.label}“? Obě čísla z tabulky „${t.nazev}“ sečti.`,
      `Najdi řádek „${ri.label}“ (${a}) a řádek „${rj.label}“ (${b}). Čísla sečti po řádech: jednotky s jednotkami, desítky s desítkami${s >= 100 ? " a stovky se stovkami" : ""}. Když jednotky přesáhnou 9, přenes desítku.`,
    ],
    explanation: `„${ri.label}“ má ${a}, „${rj.label}“ má ${b}. Slovo „dohromady“ znamená sečíst: ${a} + ${b} = ${s}.`,
  });
}

function rozdil(t: Tabulka, i: number, j: number): PracticeTask {
  const ri = t.radky[i], rj = t.radky[j];
  const a = ri.v, b = rj.v, r = a - b;
  const rozmena = a % 10 < b % 10;
  const d: Distractor[] = [
    { value: String(a + b), why: "Tohle je součet. „O kolik víc“ se počítá odčítáním." },
    { value: String(a), why: `To je jen číslo u „${ri.label}“. Musíš od něj ještě odečíst číslo u „${rj.label}“.` },
    rozmena
      ? { value: String(r + 10), why: "Desítka se rozměnila na jednotky, ale v desítkách se o ni neubralo." }
      : { value: String(r + 10), why: `Chyba v desítkách: odečti znovu desítky čísel ${a} a ${b}.` },
    { value: String(r - 1), why: `Chyba v jednotkách: odečti znovu jednotky čísel ${a} a ${b}.` },
  ];
  return choice(`${tabulkaText(t)}\n\n${t.oKolik(ri.tvar, rj.tvar)}`, String(r), tri(String(r), d), {
    hints: [
      `Porovnej čísla u „${ri.label}“ a „${rj.label}“ v tabulce „${t.nazev}“. Kolik je jejich rozdíl?`,
      `„O kolik víc“ zjistíš odčítáním: od většího čísla (u „${ri.label}“) odečti menší (u „${rj.label}“). Počítej po řádech a hlídej, jestli nemusíš rozměnit desítku.`,
    ],
    explanation: `U „${ri.label}“ je ${a}, u „${rj.label}“ ${b}. O kolik víc zjistíme odčítáním: ${a} − ${b} = ${r}.`,
  });
}

// ── Jízdní řády ─────────────────────────────────────────────────────────────

interface Spoj {
  nazev: string; // „autobus č. 12“
  druhG: string; // „zastávky“ / „stanice“
  druhA: string; // „zastávku“ / „stanici“
  zast: [string, number, number][]; // název, hodina, minuta
}

const BUS12: Spoj = {
  nazev: "autobus č. 12", druhG: "zastávky", druhA: "zastávku",
  zast: [["Náměstí", 7, 38], ["Škola", 7, 46], ["Pošta", 7, 55], ["Nádraží", 8, 7], ["Nemocnice", 8, 19]],
};
const TRAM3: Spoj = {
  nazev: "tramvaj č. 3", druhG: "zastávky", druhA: "zastávku",
  zast: [["Divadlo", 10, 12], ["Park", 10, 21], ["Muzeum", 10, 35], ["Zoo", 10, 49], ["Stadion", 11, 4]],
};
const VLAK: Spoj = {
  nazev: "vlak", druhG: "stanice", druhA: "stanici",
  zast: [["Lipová", 13, 50], ["Březí", 14, 2], ["Dubová", 14, 15], ["Olšany", 14, 31]],
};
const BUS5: Spoj = {
  nazev: "autobus č. 5", druhG: "zastávky", druhA: "zastávku",
  zast: [["Sídliště", 16, 25], ["Knihovna", 16, 33], ["Nemocnice", 16, 48], ["Koupaliště", 16, 56], ["Hřiště", 17, 9]],
};

const cas = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;
const jrText = (s: Spoj) => `Jízdní řád — ${s.nazev}:\n${s.zast.map(([n, h, m]) => `• ${n}: ${cas(h, m)}`).join("\n")}`;
const min = (n: number) => pad(n, "MINUTA");

function cteniCasu(s: Spoj, i: number): PracticeTask {
  const [stop, h, m] = s.zast[i];
  const blizke = s.zast.map((z, k) => ({ z, k })).filter(({ k }) => k !== i)
    .sort((p, q) => Math.abs(p.k - i) - Math.abs(q.k - i));
  const d = blizke.map(({ z }) => ({
    value: `v ${cas(z[1], z[2])}`,
    why: `V ${cas(z[1], z[2])} odjíždí ${s.nazev} ze ${s.druhG} ${z[0]}. Hledáš řádek „${stop}“.`,
  }));
  const correct = `v ${cas(h, m)}`;
  return choice(`${jrText(s)}\n\nV kolik hodin odjíždí ${s.nazev} ze ${s.druhG} ${stop}?`, correct, tri(correct, d), {
    hints: [
      `V jízdním řádu (${s.nazev}) najdi řádek „${stop}“.`,
      `V každém řádku jízdního řádu (${s.nazev}) je název ${s.druhG} a čas odjezdu. Najdi „${stop}“ a přečti čas za dvojtečkou: před dvojtečkou jsou hodiny, za ní minuty.`,
    ],
    explanation: `V řádku „${stop}“ je čas ${cas(h, m)}, tedy ${pad(h, "HODINA")} a ${min(m)}.`,
  });
}

/** Doba jízdy mezi dvěma zastávkami v téže hodině (jedno odčítání). */
function usek(s: Spoj, i: number, j: number): PracticeTask {
  const [A, , mi] = s.zast[i];
  const [B, h, mj] = s.zast[j];
  const dur = mj - mi;
  // Jiný úsek téže hodiny, přednostně stejně dlouhý (o stejný počet zastávek).
  const useky: [number, number][] = [];
  for (let p = 0; p < s.zast.length; p++) {
    for (let q = p + 1; q < s.zast.length; q++) {
      if (s.zast[p][1] === s.zast[q][1] && (p !== i || q !== j)) useky.push([p, q]);
    }
  }
  useky.sort((x, y) => Math.abs(x[1] - x[0] - (j - i)) - Math.abs(y[1] - y[0] - (j - i)));
  const jiny = useky[0];
  const jinyDur = s.zast[jiny[1]][2] - s.zast[jiny[0]][2];
  const d: Distractor[] = [
    { value: min(mj), why: `${mj} je jen počet minut v čase odjezdu ze ${s.druhG} ${B}. Doba jízdy je rozdíl dvou časů.` },
    { value: min(jinyDur), why: `Tak dlouho trvá jízda mezi jinými zastávkami (${s.zast[jiny[0]][0]} → ${s.zast[jiny[1]][0]}).` },
    { value: min(dur + 10), why: `Odečítej znovu minuty: ${mj} − ${mi}.` },
    { value: min(mi), why: `${mi} je jen počet minut v čase odjezdu ze ${s.druhG} ${A}. Doba jízdy je rozdíl dvou časů.` },
  ];
  return choice(
    `${jrText(s)}\n\nKolik minut jede ${s.nazev} ze ${s.druhG} ${A} na ${s.druhA} ${B}?`,
    min(dur), tri(min(dur), d), {
      hints: [
        `Kdy odjíždí ${s.nazev} ze ${s.druhG} ${A} a kdy ze ${s.druhG} ${B}?`,
        `Od pozdějšího času (${B}, ${cas(h, mj)}) odečti dřívější (${A}, ${cas(h, mi)}). Oba časy jsou ve stejné hodině, takže stačí odečíst minuty.`,
      ],
      explanation: `${cap(s.nazev)} odjíždí ze ${s.druhG} ${A} v ${cas(h, mi)} a ze ${s.druhG} ${B} v ${cas(h, mj)}. Doba jízdy je rozdíl časů: ${mj} − ${mi} = ${dur}, tedy ${min(dur)}.`,
    });
}

/** Doba jízdy přes celou hodinu (dva kroky: do celé hodiny + po ní). */
function presHodinu(s: Spoj, i: number, j: number): PracticeTask {
  const [A, h1, m1] = s.zast[i];
  const [B, h2, m2] = s.zast[j];
  const doHodiny = 60 - m1;
  const dur = doHodiny + m2;
  const d: Distractor[] = [
    { value: min(h2 * 100 + m2 - (h1 * 100 + m1)), why: "Časy se neodečítají jako obyčejná čísla. Hodina má 60 minut, ne 100." },
    { value: min(doHodiny), why: `To je jen doba do ${h2}:00. Přičti ještě minuty po ${h2}:00.` },
    { value: min(m2), why: `To jsou jen minuty po ${h2}:00. Chybí doba od ${cas(h1, m1)} do ${h2}:00.` },
    { value: min(Math.abs(m1 - m2)), why: "Minuty se jen odečetly od sebe. Když jízda přechází přes celou hodinu, rozděl ji na dvě části." },
  ];
  return choice(
    `${jrText(s)}\n\nKolik minut jede ${s.nazev} ze ${s.druhG} ${A} na ${s.druhA} ${B}?`,
    min(dur), tri(min(dur), d), {
      hints: [
        `Jízda ze ${s.druhG} ${A} na ${s.druhA} ${B} přechází přes ${h2}:00. Kolik minut zbývá od ${cas(h1, m1)} do ${h2}:00?`,
        `Rozděl jízdu na dvě části: od ${cas(h1, m1)} do ${h2}:00 a od ${h2}:00 do ${cas(h2, m2)}. Obě části sečti. Nepočítej časy jako obyčejná čísla — hodina má 60 minut, ne 100.`,
      ],
      explanation: `Od ${cas(h1, m1)} do ${h2}:00 je ${min(doHodiny)} a od ${h2}:00 do ${cas(h2, m2)} je ${min(m2)}. Celkem ${doHodiny} + ${m2} = ${dur}, tedy ${min(dur)}.`,
    });
}

/** Zpoždění, které posune odjezd přes celou hodinu. */
function zpozdeni(s: Spoj, i: number, z: number): PracticeTask {
  const [stop, h, m] = s.zast[i];
  const nm = m + z - 60;
  const correct = `v ${cas(h + 1, nm)}`;
  const dalsi = s.zast[i + 1];
  const d: Distractor[] = [
    { value: `v ${h}:${m + z}`, why: "Minut může být nejvýš 59. Ze 60 minut vznikne celá hodina navíc." },
    { value: `v ${cas(h, m - z)}`, why: `Zpoždění znamená, že ${s.nazev} odjede později. Minuty se přičítají, ne odečítají.` },
    { value: `v ${cas(h + 1, m)}`, why: `Zpoždění je jen ${min(z)}, ne celá hodina.` },
    ...(dalsi ? [{ value: `v ${cas(dalsi[1], dalsi[2])}`, why: `To je čas odjezdu ze ${s.druhG} ${dalsi[0]} podle jízdního řádu.` }] : []),
  ];
  return choice(
    `${jrText(s)}\n\n${cap(s.nazev)} má zpoždění ${min(z)}. V kolik hodin odjede ze ${s.druhG} ${stop}?`,
    correct, tri(correct, d), {
      hints: [
        `Kdy má ${s.nazev} podle jízdního řádu odjíždět ze ${s.druhG} ${stop}? K tomu času přičti zpoždění.`,
        `Přičti ${min(z)} k času ${cas(h, m)}. Když minut vyjde 60 nebo víc, odečti od nich 60 a hodinu zvětši o 1.`,
      ],
      explanation: `Podle jízdního řádu odjíždí ${s.nazev} ze ${s.druhG} ${stop} v ${cas(h, m)}. ${m} + ${z} = ${min(m + z)}, to je 1 hodina a ${min(nm)}. Odjede proto v ${cas(h + 1, nm)}.`,
    });
}

// ── Kroužkové diagramy ──────────────────────────────────────────────────────

interface Diagram {
  nazev: string;
  m: number;
  /** Co znamená jeden kroužek („jednoho žáka“, „2 knihy“). */
  kruh: string;
  radky: Radek[];
  kolik: (t: string) => string;
}

const kruzku = (k: number) => `${k} ${plural(k, "kroužek", "kroužky", "kroužků")}`;
const knih = (n: number) => `${n} ${plural(n, "kniha", "knihy", "knih")}`;
const vstupenek = (n: number) => `${n} ${plural(n, "vstupenka", "vstupenky", "vstupenek")}`;

const OVOCE: Diagram = {
  nazev: "Oblíbené ovoce ve 3. A", m: 1, kruh: "jednoho žáka",
  radky: [
    { label: "Jablka", tvar: "jablka", v: 7 }, { label: "Banány", tvar: "banány", v: 4 },
    { label: "Hrušky", tvar: "hrušky", v: 9 }, { label: "Švestky", tvar: "švestky", v: 3 },
  ],
  kolik: (t) => `Kolik žáků má nejraději ${t}?`,
};
const PTACI: Diagram = {
  nazev: "Ptáci na krmítku", m: 1, kruh: "jednoho ptáka",
  radky: [
    { label: "Sýkory", tvar: "sýkor", v: 8 }, { label: "Vrabci", tvar: "vrabců", v: 11 },
    { label: "Kosi", tvar: "kosů", v: 5 }, { label: "Straky", tvar: "strak", v: 2 },
  ],
  kolik: (t) => `Kolik ${t} přiletělo na krmítko?`,
};
const CTENI: Diagram = {
  nazev: "Přečtené knihy ve 3. B", m: 2, kruh: knih(2),
  radky: [
    { label: "Leden", tvar: "v lednu", v: 5 }, { label: "Únor", tvar: "v únoru", v: 3 },
    { label: "Březen", tvar: "v březnu", v: 7 }, { label: "Duben", tvar: "v dubnu", v: 4 },
  ],
  kolik: (t) => `Kolik knih přečetla třída ${t}?`,
};
const KINO: Diagram = {
  nazev: "Prodané vstupenky do kina", m: 5, kruh: vstupenek(5),
  radky: [
    { label: "Pondělí", tvar: "v pondělí", v: 4 }, { label: "Úterý", tvar: "v úterý", v: 6 },
    { label: "Středa", tvar: "ve středu", v: 3 }, { label: "Čtvrtek", tvar: "ve čtvrtek", v: 8 },
  ],
  kolik: (t) => `Kolik vstupenek se prodalo ${t}?`,
};

const diagramText = (g: Diagram) =>
  `Diagram „${g.nazev}“ (jeden kroužek ● znamená ${g.kruh}):\n${g.radky.map((r) => `• ${r.label}: ${"●".repeat(r.v)}`).join("\n")}`;

function diagramCteni(g: Diagram, i: number): PracticeTask {
  const r = g.radky[i];
  const k = r.v, ans = k * g.m;
  const jine = g.radky.filter((_, x) => x !== i);
  const d: Distractor[] = g.m === 1
    ? jine.map((o) => ({ value: String(o.v), why: `Tolik kroužků má řádek „${o.label}“. Hledáš řádek „${r.label}“.` }))
    : [
      { value: String(k), why: `To je jen počet kroužků. Každý kroužek ale znamená ${g.kruh}.` },
      { value: String(k + g.m), why: `Ke kroužkům se přičetlo ${g.m}. Každý kroužek se ale počítá jako ${g.kruh}, takže se násobí.` },
      { value: String((k + 1) * g.m), why: `To by bylo o jeden kroužek víc, než má řádek „${r.label}“.` },
      ...jine.map((o) => ({ value: String(o.v * g.m), why: `Tolik znamenají kroužky v řádku „${o.label}“.` })),
    ];
  return choice(`${diagramText(g)}\n\n${g.kolik(r.tvar)}`, String(ans), tri(String(ans), d), {
    hints: [
      `V diagramu „${g.nazev}“ spočítej kroužky v řádku „${r.label}“.`,
      g.m === 1
        ? `Každý kroužek znamená ${g.kruh}. Kroužky v řádku „${r.label}“ počítej po jednom a ukazuj si prstem, ať žádný nevynecháš.`
        : `Nejdřív spočítej kroužky v řádku „${r.label}“. Každý kroužek ale znamená ${g.kruh}, takže počet kroužků vynásob ${g.m} (nebo počítej po ${g.m}).`,
    ],
    explanation: g.m === 1
      ? `Řádek „${r.label}“ má ${kruzku(k)} a každý kroužek znamená ${g.kruh}. Proto je odpověď ${ans}.`
      : `Řádek „${r.label}“ má ${kruzku(k)} a každý znamená ${g.kruh}: ${k} × ${g.m} = ${ans}.`,
  });
}

// ── Vlastní dvoukrokové úlohy L3 ────────────────────────────────────────────

function vlastni(kontext: string, otazka: string, ans: string, d: [Distractor, Distractor, Distractor], h0: string, h1: string, expl: string): PracticeTask {
  return choice(`${kontext}\n\n${otazka}`, ans, d, { hints: [h0, h1], explanation: expl });
}

function l3Vlastni(): PracticeTask[] {
  return [
    vlastni(tabulkaText(ZOO), "V zoo přibyli 3 další lvi. O kolik víc tučňáků než lvů je teď v zoo?", "8", [
      { value: "11", why: "Nezapočítali se 3 noví lvi. Lvů je teď 6 + 3." },
      { value: "26", why: "Čísla se sečetla. „O kolik víc“ se počítá odčítáním." },
      { value: "14", why: "Od tučňáků se odečetli jen 3 noví lvi, ne všichni lvi." },
    ], "Kolik lvů je v zoo teď, když k nim přibyli 3 další?",
    "Nejdřív spočítej, kolik lvů je teď: k číslu z tabulky přičti 3. Potom od počtu tučňáků odečti nový počet lvů.",
    "Lvů je teď 6 + 3 = 9. Tučňáků je 17, takže 17 − 9 = 8. Tučňáků je o 8 víc."),
    vlastni(tabulkaText(ZMRZLINY), "O kolik víc zmrzlin se prodalo ve středu a ve čtvrtek dohromady než v pondělí a v úterý dohromady?", "16", [
      { value: "57", why: "To je jen součet za středu a čtvrtek. Ještě od něj odečti součet za pondělí a úterý." },
      { value: "41", why: "To je součet za pondělí a úterý. Porovnej ho se středou a čtvrtkem." },
      { value: "98", why: "Sečetly se všechny čtyři dny. Otázka se ptá na rozdíl." },
    ], "Sečti zvlášť středu se čtvrtkem a zvlášť pondělí s úterým.",
    "Úloha má dva kroky. Nejdřív spočítej dva součty: středa + čtvrtek a pondělí + úterý. Potom od většího součtu odečti menší.",
    "Středa a čtvrtek: 31 + 26 = 57. Pondělí a úterý: 23 + 18 = 41. Rozdíl 57 − 41 = 16."),
    vlastni(tabulkaText(KNIHY), "Knihovna chtěla za leden a únor dohromady půjčit 100 knih. Kolik knih do toho chybělo?", "23", [
      { value: "77", why: "To je počet knih půjčených v lednu a únoru. Otázka se ptá, kolik chybělo do 100." },
      { value: "58", why: "Od 100 se odečetl jen leden. Musíš odečíst leden i únor." },
      { value: "65", why: "Od 100 se odečetl jen únor. Musíš odečíst leden i únor." },
    ], "Kolik knih si děti půjčily v lednu a v únoru dohromady?",
    "Nejdřív sečti knihy za leden a únor. Potom zjisti, kolik ještě chybí do 100: od 100 odečti ten součet.",
    "Leden a únor: 42 + 35 = 77. Do 100 chybí 100 − 77 = 23."),
    vlastni(tabulkaText(BODY), "Tým Orli dostal ještě 15 bodů navíc. O kolik bodů má teď méně než tým Lišky?", "7", [
      { value: "22", why: "Nezapočítalo se 15 bodů navíc. Orli mají teď 59 + 15." },
      { value: "17", why: "Při odčítání 81 − 74 se rozměnila desítka, ale v desítkách se o ni neubralo." },
      { value: "155", why: "Čísla se sečetla. „O kolik méně“ se počítá odčítáním." },
    ], "Kolik bodů mají Orli teď, když dostali 15 bodů navíc?",
    "Nejdřív k bodům týmu Orli přičti 15. Potom odečti nový počet bodů Orlů od bodů týmu Lišky. Pozor na rozměňování desítky.",
    "Orli mají teď 59 + 15 = 74 bodů. Lišky mají 81, takže 81 − 74 = 7. Orli mají o 7 bodů méně."),
    vlastni(tabulkaText(PAPIR), "O kolik kilogramů víc nasbíraly třídy 3. A a 3. C dohromady než třídy 3. B a 3. D dohromady?", "53", [
      { value: "268", why: "To je jen součet tříd 3. A a 3. C. Ještě od něj odečti součet 3. B a 3. D." },
      { value: "215", why: "To je součet tříd 3. B a 3. D. Porovnej ho se třídami 3. A a 3. C." },
      { value: "483", why: "Sečetly se všechny čtyři třídy. Otázka se ptá na rozdíl." },
    ], "Sečti zvlášť třídy 3. A a 3. C a zvlášť třídy 3. B a 3. D.",
    "Úloha má dva kroky. Nejdřív spočítej oba součty po řádech (jednotky, desítky, stovky). Potom od většího součtu odečti menší.",
    "3. A a 3. C: 125 + 143 = 268. 3. B a 3. D: 98 + 117 = 215. Rozdíl 268 − 215 = 53."),
    vlastni(tabulkaText(HRAD), "O kolik víc návštěvníků přišlo v sobotu a v neděli dohromady než v pátek a v pondělí dohromady?", "494", [
      { value: "737", why: "To je jen součet za sobotu a neděli. Ještě od něj odečti pátek a pondělí." },
      { value: "243", why: "To je součet za pátek a pondělí. Porovnej ho se sobotou a nedělí." },
      { value: "980", why: "Sečetly se všechny čtyři dny. Otázka se ptá na rozdíl." },
    ], "Sečti zvlášť sobotu s nedělí a zvlášť pátek s pondělím.",
    "Úloha má dva kroky. Nejdřív spočítej oba součty a hlídej přenos přes desítku i stovku. Potom od většího součtu odečti menší.",
    "Sobota a neděle: 342 + 395 = 737. Pátek a pondělí: 186 + 57 = 243. Rozdíl 737 − 243 = 494."),
    vlastni(tabulkaText(ZOO), "Kolik zvířat z tabulky je v zoo celkem?", "40", [
      { value: "34", why: "Chybí lvi. Sečti všechny čtyři řádky." },
      { value: "36", why: "Chybí sloni. Sečti všechny čtyři řádky." },
      { value: "50", why: "Jednotky 6 + 4 + 3 + 7 dají 2 desítky, ne 3. Přenos je o 1 menší." },
    ], "Sečti čísla ze všech čtyř řádků tabulky „Zvířata v zoo“.",
    "Čtyři čísla sčítej postupně: nejdřív první dvě, k mezivýsledku přičti třetí a pak čtvrté. Dobře se hodí začít dvojicí, která dá celou desítku.",
    "6 + 4 = 10, 10 + 13 = 23, 23 + 17 = 40. V zoo je celkem 40 zvířat z tabulky."),
    vlastni(tabulkaText(ZMRZLINY), "Kolik zmrzlin se prodalo za všechny čtyři dny?", "98", [
      { value: "72", why: "Chybí čtvrtek. Sečti všechny čtyři dny." },
      { value: "67", why: "Chybí středa. Sečti všechny čtyři dny." },
      { value: "88", why: "Jednotky 3 + 8 + 1 + 6 dají 18, tedy 1 desítku navíc. Ta se ztratila." },
    ], "Sečti počty zmrzlin ze všech čtyř dnů v tabulce „Prodané zmrzliny“.",
    "Sčítej postupně: pondělí a úterý, pak přičti středu a nakonec čtvrtek. Po každém kroku si mezivýsledek zapiš a hlídej přenos.",
    "23 + 18 = 41, 41 + 31 = 72, 72 + 26 = 98. Za čtyři dny se prodalo 98 zmrzlin."),
    vlastni(tabulkaText(KNIHY), "Kolik knih si děti půjčily za všechny čtyři měsíce?", "182", [
      { value: "134", why: "Chybí duben. Sečti všechny čtyři měsíce." },
      { value: "125", why: "Chybí březen. Sečti všechny čtyři měsíce." },
      { value: "172", why: "Jednotky 2 + 5 + 7 + 8 dají 22, tedy 2 desítky navíc. Jedna z nich se ztratila." },
    ], "Sečti počty knih ze všech čtyř měsíců v tabulce „Vypůjčené knihy ve školní knihovně“.",
    "Sčítej postupně: leden a únor, pak přičti březen a nakonec duben. Po každém kroku si mezivýsledek zapiš a hlídej přenos přes desítku i stovku.",
    "42 + 35 = 77, 77 + 57 = 134, 134 + 48 = 182. Za čtyři měsíce si děti půjčily 182 knih."),
    vlastni(tabulkaText(PAPIR), "Kolik kilogramů papíru nasbíraly všechny čtyři třídy dohromady?", "483", [
      { value: "358", why: "Chybí třída 3. A. Sečti všechny čtyři třídy." },
      { value: "385", why: "Chybí třída 3. B. Sečti všechny čtyři třídy." },
      { value: "473", why: "Jednotky 5 + 8 + 3 + 7 dají 23, tedy 2 desítky navíc. Jedna z nich se ztratila." },
    ], "Sečti kilogramy ze všech čtyř řádků tabulky „Sběr papíru v kilogramech“.",
    "Sčítej postupně: 3. A a 3. B, pak přičti 3. C a nakonec 3. D. Po každém kroku si mezivýsledek zapiš a hlídej přenos přes desítku i stovku.",
    "125 + 98 = 223, 223 + 143 = 366, 366 + 117 = 483. Třídy nasbíraly 483 kg papíru."),
    vlastni(tabulkaText(HRAD), "Kolik návštěvníků přišlo na hrad za všechny čtyři dny?", "980", [
      { value: "923", why: "Chybí pondělí. Sečti všechny čtyři dny." },
      { value: "794", why: "Chybí pátek. Sečti všechny čtyři dny." },
      { value: "880", why: "Při sčítání desítek vznikla stovka navíc, ale ke stovkám se nepřičetla." },
    ], "Sečti návštěvníky ze všech čtyř dnů v tabulce „Návštěvníci hradu“.",
    "Sčítej postupně: pátek a sobota, pak přičti neděli a nakonec pondělí. Po každém kroku si mezivýsledek zapiš a hlídej přenos přes desítku i stovku.",
    "186 + 342 = 528, 528 + 395 = 923, 923 + 57 = 980. Za čtyři dny přišlo 980 návštěvníků."),
    vlastni(diagramText(CTENI), "O kolik víc knih přečetla třída v březnu než v únoru?", "8", [
      { value: "4", why: "To je rozdíl kroužků. Každý kroužek ale znamená 2 knihy." },
      { value: "14", why: "To je jen počet knih v březnu. Ještě od něj odečti únor." },
      { value: "20", why: "Kroužky se sečetly. „O kolik víc“ se počítá odčítáním." },
    ], "Kolik kroužků má březen a kolik únor v diagramu „Přečtené knihy ve 3. B“?",
    "Nejdřív zjisti, o kolik kroužků má březen víc než únor. Pak si vzpomeň, kolik knih znamená jeden kroužek, a rozdíl kroužků jím vynásob.",
    "Březen má 7 kroužků, únor 3, rozdíl je 4 kroužky. Jeden kroužek znamená 2 knihy: 4 × 2 = 8."),
    vlastni(diagramText(KINO), "O kolik víc vstupenek se prodalo ve čtvrtek než v pondělí?", "20", [
      { value: "4", why: "To je rozdíl kroužků. Každý kroužek ale znamená 5 vstupenek." },
      { value: "40", why: "To je jen počet vstupenek ve čtvrtek. Ještě od něj odečti pondělí." },
      { value: "60", why: "Kroužky se sečetly. „O kolik víc“ se počítá odčítáním." },
    ], "Kolik kroužků má čtvrtek a kolik pondělí v diagramu „Prodané vstupenky do kina“?",
    "Nejdřív zjisti, o kolik kroužků má čtvrtek víc než pondělí. Jeden kroužek znamená 5 vstupenek, takže rozdíl kroužků vynásob pěti.",
    "Čtvrtek má 8 kroužků, pondělí 4, rozdíl jsou 4 kroužky. Každý znamená 5 vstupenek: 4 × 5 = 20."),
    vlastni(diagramText(KINO), "O kolik víc vstupenek se prodalo v úterý než ve středu?", "15", [
      { value: "3", why: "To je rozdíl kroužků. Každý kroužek ale znamená 5 vstupenek." },
      { value: "30", why: "To je jen počet vstupenek v úterý. Ještě od něj odečti středu." },
      { value: "45", why: "Kroužky se sečetly. „O kolik víc“ se počítá odčítáním." },
    ], "Kolik kroužků má úterý a kolik středa v diagramu „Prodané vstupenky do kina“?",
    "Spočítej kroužky v úterý a ve středu a zjisti jejich rozdíl. Každý kroužek znamená 5 vstupenek, takže rozdíl kroužků vynásob pěti (nebo počítej po pěti).",
    "Úterý má 6 kroužků, středa 3, rozdíl jsou 3 kroužky. Každý znamená 5 vstupenek: 3 × 5 = 15."),
    vlastni(diagramText(KINO), "Kolik vstupenek se prodalo za všechny čtyři dny?", "105", [
      { value: "21", why: "To je jen počet kroužků. Každý kroužek ale znamená 5 vstupenek." },
      { value: "100", why: "Jeden kroužek se nezapočítal. Spočítej znovu kroužky ve všech řádcích." },
      { value: "26", why: "Ke kroužkům se přičetlo 5. Každý kroužek se ale počítá jako 5 vstupenek, takže se násobí." },
    ], "Kolik kroužků je v diagramu „Prodané vstupenky do kina“ dohromady?",
    "Nejdřív spočítej všechny kroužky ze všech čtyř řádků. Každý kroužek znamená 5 vstupenek, takže celkový počet kroužků vynásob pěti.",
    "Kroužků je 4 + 6 + 3 + 8 = 21. Každý znamená 5 vstupenek: 21 × 5 = 105."),
  ];
}

// ── Banky úrovní ────────────────────────────────────────────────────────────

function bankaL1(): PracticeTask[] {
  return [
    ...[ZOO, ZMRZLINY, KNIHY, BODY].flatMap((t) => [0, 1, 2, 3].map((i) => cteni(t, i))),
    ...[ZOO, ZMRZLINY, KNIHY].flatMap((t) => [extrem(t, true), extrem(t, false)]),
    ...[[BUS12, [1, 2, 3]], [TRAM3, [1, 2, 4]], [VLAK, [1, 2, 3]], [BUS5, [1, 2, 4]]]
      .flatMap(([s, idx]) => (idx as number[]).map((i) => cteniCasu(s as Spoj, i))),
    ...[OVOCE, PTACI].flatMap((g) => [0, 1, 2, 3].map((i) => diagramCteni(g, i))),
  ];
}

function bankaL2(): PracticeTask[] {
  return [
    soucet(ZOO, 0, 2), soucet(ZOO, 1, 3), rozdil(ZOO, 3, 0),
    soucet(ZMRZLINY, 0, 1), soucet(ZMRZLINY, 2, 3), rozdil(ZMRZLINY, 2, 1),
    soucet(KNIHY, 0, 2), soucet(KNIHY, 1, 3), rozdil(KNIHY, 2, 1),
    soucet(BODY, 0, 1), soucet(BODY, 2, 3), rozdil(BODY, 1, 2),
    soucet(PAPIR, 0, 1), soucet(PAPIR, 2, 3), rozdil(PAPIR, 2, 1),
    soucet(HRAD, 0, 1), soucet(HRAD, 2, 3), rozdil(HRAD, 2, 0),
    usek(BUS12, 0, 1), usek(BUS12, 1, 2), usek(BUS12, 0, 2),
    usek(TRAM3, 0, 1), usek(TRAM3, 1, 2), usek(TRAM3, 2, 3), usek(TRAM3, 0, 2),
    usek(VLAK, 1, 2), usek(VLAK, 2, 3), usek(VLAK, 1, 3),
    usek(BUS5, 0, 1), usek(BUS5, 1, 2), usek(BUS5, 2, 3), usek(BUS5, 0, 3),
    ...[CTENI, KINO].flatMap((g) => [0, 1, 2, 3].map((i) => diagramCteni(g, i))),
  ];
}

function bankaL3(): PracticeTask[] {
  return [
    presHodinu(BUS12, 2, 3), presHodinu(BUS12, 1, 4), presHodinu(BUS12, 0, 4),
    presHodinu(TRAM3, 3, 4), presHodinu(TRAM3, 2, 4), presHodinu(TRAM3, 0, 4),
    presHodinu(VLAK, 0, 1), presHodinu(VLAK, 0, 2), presHodinu(VLAK, 0, 3),
    presHodinu(BUS5, 3, 4), presHodinu(BUS5, 1, 4),
    zpozdeni(BUS12, 2, 15), zpozdeni(TRAM3, 3, 20), zpozdeni(VLAK, 0, 20),
    zpozdeni(BUS5, 2, 18), zpozdeni(TRAM3, 2, 30), zpozdeni(BUS5, 3, 12),
    ...l3Vlastni(),
  ];
}

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? bankaL1() : level === 2 ? bankaL2() : bankaL3());
}

export const TABULKYJIZDNIRADYDIAGRAMY: TopicMetadata[] = [
  {
    id: "g3-mat-tabulky-diagramy",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-jizdni-rady-jednoduche-diagramy",
    title: "Tabulky, jízdní řády, jednoduché diagramy",
    studentTitle: "Co říká tabulka?",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky nebo jízdního řádu a odpovíš na otázky.",
    keywords: ["tabulka", "jízdní řád", "diagram", "data", "čtení tabulek", "sloupcový graf"],
    goals: [
      "Číst data z jednoduché tabulky.",
      "Orientovat se v jízdním řádu.",
      "Porovnat hodnoty a provést jednoduchý výpočet z tabulky.",
    ],
    boundaries: ["Jednoduché tabulky, max 5 řádků.", "Bez složitých grafů."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka má řádky (vodorovně) a sloupce (svisle). Najdi správný řádek, pak správný sloupec.",
      steps: [
        "Přečti si nadpisy sloupců.",
        "Najdi řádek, který hledáš.",
        "Odečti hodnotu ze správného sloupce.",
        "Pro výpočty: sečti nebo odečti potřebné hodnoty.",
      ],
      commonMistake: "Záměna řádku a sloupce — vždy začni od nadpisu.",
      example: "V tabulce prodejů najdi středu a přečti číslo v sloupci 'Počet'.",
    },
  },
];
