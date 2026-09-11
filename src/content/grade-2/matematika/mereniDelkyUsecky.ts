import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pad } from "@/lib/czechGrammar";

/**
 * Přepsáno 2026-09-11 (inventura obsahu). Dřív: krátké ruční seznamy
 * (8/11/12 úloh), jen jedna nápověda, žádná zpětná vazba u chybných možností
 * a na L3 klíč „5 cm“ přímo ve znění otázky („5 cm nebo 40 mm?“), což shodilo
 * bránu. Teď parametrické úlohy, u nichž nápovědy, vysvětlení i zpětná vazba
 * nesou čísla konkrétní úlohy, a klíč nikdy nestojí doslova v zadání.
 *
 *  L1 — čtení délky na pravítku, úsečka začíná u nuly (rozpoznání).
 *  L2 — pravítko nezačíná u nuly, součet dvou částí, rozdíl dvou úseček (aplikace).
 *  L3 — chybějící část (inverze), převod cm → mm, dvoukrokové úlohy,
 *       „dvakrát delší“ (transfer).
 *
 * Délky do 30 cm, jednotky cm a mm (RVP 2. ročníku).
 */

const cm = (n: number) => `${n} cm`;

/** Vybere 3 různé distraktory (≠ klíč, kladná délka) v pořadí priority. */
function tri(correct: string, cands: (Distractor | null)[]): [Distractor, Distractor, Distractor] {
  const out: Distractor[] = [];
  for (const d of cands) {
    if (!d || d.value === correct || out.some((o) => o.value === d.value)) continue;
    if (!/^[1-9]\d* (cm|mm)$/.test(d.value)) continue;
    out.push(d);
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Málo distraktorů pro ${correct}`);
  return out as [Distractor, Distractor, Distractor];
}

// ── L1 — pravítko od nuly ────────────────────────────────────────────────────

function odNuly(n: number): PracticeTask {
  const key = cm(n);
  return choice(`Úsečka na pravítku sahá od 0 do ${n}. Kolik měří?`, key, tri(key, [
    { value: cm(n + 1), why: "Spočítal jsi čárky i s tou u nuly. Délku ale tvoří dílky mezi čárkami a těch je o jeden méně než čárek." },
    { value: cm(n - 1), why: "Jeden centimetr chybí — asi jsi začal počítat až od čísla 1. Dílek od 0 do 1 se počítá také." },
    { value: `${n} mm`, why: "Čísla na pravítku ukazují centimetry. Milimetry jsou jen ty nejmenší čárky mezi nimi." },
    { value: cm(n + 2), why: "To je víc, než kolik dílků úsečka na pravítku zabírá." },
  ]), {
    hints: [
      `Úsečka začíná přesně u nuly a končí u čísla ${n}. Co ti číslo na konci prozradí?`,
      `Každý dílek mezi dvěma sousedními čísly na pravítku měří 1 cm. Když úsečka začíná u nuly, spočítej dílky od 0 až po ${n} — mezery, ne čárky.`,
    ],
    explanation: `Pravítko měří od nuly, takže číslo na konci úsečky rovnou udává její délku: od 0 do ${n} je ${pad(n, "CENTIMETR")}.`,
  });
}

// ── L2 — pravítko mimo nulu, součet, rozdíl ─────────────────────────────────

function mimoNulu(s: number, e: number): PracticeTask {
  const L = e - s;
  const key = cm(L);
  return choice(`Úsečka na pravítku začíná u ${s} a končí u ${e}. Kolik měří?`, key, tri(key, [
    { value: cm(e), why: `Přečetl jsi jen číslo na konci. To stačí, jen když úsečka začíná u nuly — tahle začíná u ${s}.` },
    { value: cm(e + s), why: `Čísla ${s} a ${e} jsi sečetl. Délka je vzdálenost od začátku ke konci, proto se odečítá.` },
    { value: cm(L + 1), why: "Počítal jsi čárky místo dílků — čárek je vždycky o jednu víc než centimetrů." },
    { value: cm(L - 1), why: `Jeden dílek ti vypadl. Spočítej mezery mezi čárkami od ${s} do ${e} ještě jednou.` },
  ]), {
    hints: [
      `Úsečka nezačíná u nuly, ale u čísla ${s}. Stačí proto přečíst číslo ${e} na konci?`,
      `Délka je vzdálenost od začátku ke konci: od čísla ${e} odečti ${s}. Nebo spočítej dílky (mezery mezi čísly) od ${s} do ${e}.`,
    ],
    explanation: `Úsečka nezačíná u nuly, proto se délka počítá jako konec minus začátek: ${e} − ${s} = ${L}, tedy ${pad(L, "CENTIMETR")}.`,
  });
}

function soucet(a: number, b: number): PracticeTask {
  const sum = a + b;
  const key = cm(sum);
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const postup = big < 10 && sum > 10
    ? `nejdřív doplň ${big} do deseti a pak přičti zbytek čísla ${small}`
    : `začni u většího čísla ${big} a přičti k němu ${small}`;
  return choice(`Úsečka AC se skládá z částí ${a} cm a ${b} cm. Kolik měří?`, key, tri(key, [
    { value: cm(big - small), why: "Délky jsi odečetl. Když se úsečka skládá ze dvou částí, je dlouhá jako obě části dohromady." },
    { value: cm(sum + 1), why: "O centimetr víc — při počítání po jedné jsi započítal i číslo, od kterého jsi začínal." },
    { value: cm(sum - 1), why: "O centimetr méně — při počítání po jedné ti jeden krok vypadl." },
    { value: cm(sum + 10), why: "O deset víc — při přechodu přes desítku jsi přidal desítku navíc." },
  ]), {
    hints: [
      `Úsečka AC je složená ze dvou kusů: ${a} cm a ${b} cm. Mají se délky sečíst, nebo odečíst?`,
      `Celá úsečka je tak dlouhá jako obě části položené za sebou, takže sčítáš ${a} + ${b}. Postup: ${postup}.`,
    ],
    explanation: `Části úsečky leží za sebou, proto se jejich délky sčítají: ${a} cm + ${b} cm = ${sum} cm.`,
  });
}

function rozdil(a: number, b: number): PracticeTask {
  const d = a - b;
  const key = cm(d);
  return choice(`Úsečka AB měří ${a} cm, úsečka CD ${b} cm. O kolik je AB delší?`, key, tri(key, [
    { value: cm(a + b), why: "Délky jsi sečetl. Otázka „o kolik je delší“ se ptá na rozdíl, takže se odečítá." },
    { value: cm(d + 1), why: `O centimetr víc — zkontroluj odčítání přičítáním: od ${b} dojdi na ${a} a počítej kroky.` },
    { value: cm(d - 1), why: `O centimetr méně — zkontroluj odčítání přičítáním: od ${b} dojdi na ${a} a počítej kroky.` },
    { value: cm(b), why: "To je délka úsečky CD, ne rozdíl mezi úsečkami." },
  ]), {
    hints: [
      `AB měří ${a} cm a CD ${b} cm. Kolik centimetrů musíš ke kratší přidat, aby byla stejně dlouhá?`,
      `„O kolik delší“ znamená rozdíl: od delší délky ${a} odečti kratší ${b}. Můžeš také přičítat od ${b}, dokud nedojdeš na ${a}, a počítat kroky.`,
    ],
    explanation: `Rozdíl délek zjistíš odečtením: ${a} − ${b} = ${d}. O ${pad(d, "CENTIMETR")} je AB delší než CD.`,
  });
}

// ── L3 — inverze, převod na mm, dva kroky, dvakrát delší ────────────────────

function chybiCast(c: number, a: number): PracticeTask {
  const bc = c - a;
  const key = cm(bc);
  return choice(`Úsečka AC měří ${c} cm, její část AB ${a} cm. Kolik měří BC?`, key, tri(key, [
    { value: cm(c + a), why: "Délky jsi sečetl. BC je jen zbytek úsečky AC, proto od celé délky část AB odečti." },
    { value: cm(a), why: "To je délka části AB, ta je v zadání. Ptáme se na druhou část, BC." },
    { value: cm(bc + 1), why: `O centimetr víc. Zkouška: zbytek plus ${a} musí dát přesně ${c}.` },
    { value: cm(bc - 1), why: `O centimetr méně. Zkouška: zbytek plus ${a} musí dát přesně ${c}.` },
  ]), {
    hints: [
      `Celá úsečka AC měří ${c} cm, kus AB z ní zabírá ${a} cm. Kolik zbývá na BC?`,
      `AB a BC dohromady dávají celou AC. Hledáš chybějící část, takže počítáš ${c} − ${a}. Zkontroluj to: zbytek a ${a} musí dohromady dát ${c}.`,
    ],
    explanation: `AC = AB + BC, takže BC = AC − AB = ${c} − ${a} = ${bc} cm. Zkouška: ${a} + ${bc} = ${c}.`,
  });
}

function naMilimetry(n: number): PracticeTask {
  const key = `${n * 10} mm`;
  return choice(`Úsečka měří ${n} cm. Kolik je to milimetrů?`, key, tri(key, [
    { value: `${n} mm`, why: "Číslo zůstalo stejné. Milimetr je menší než centimetr, takže milimetrů musí vyjít víc." },
    { value: `${n * 100} mm`, why: "1 cm má 10 mm, ne 100 mm. Násobil jsi stovkou." },
    { value: `${n + 10} mm`, why: `K číslu ${n} jsi jen přičetl 10. Deset milimetrů má ale každý centimetr, proto se násobí.` },
  ]), {
    hints: [
      `Kolik milimetrových dílků je na pravítku v jednom centimetru? A centimetrů máš ${n}.`,
      `1 cm = 10 mm. Úsečka má ${pad(n, "CENTIMETR")} a v každém je 10 mm, takže počítáš ${n} × 10 — neboli přičteš desítku ${n}krát.`,
    ],
    explanation: `1 cm má 10 mm, takže ${n} cm má ${n}krát víc milimetrů: ${n} × 10 = ${n * 10} mm.`,
  });
}

function dvaKroky(a: number, b: number): PracticeTask {
  const cd = a + b;
  const total = a + cd;
  const key = cm(total);
  return choice(`Úsečka AB má ${a} cm, CD o ${b} cm víc. Kolik mají dohromady?`, key, tri(key, [
    { value: cm(cd), why: "To je jen délka CD. Otázka chce obě úsečky dohromady, přičti ještě AB." },
    { value: cm(2 * a), why: `Počítal jsi, jako by CD byla stejně dlouhá jako AB. Je ale o ${b} cm delší.` },
    { value: cm(total + b), why: `Rozdíl ${b} cm jsi přičetl dvakrát. Delší je jen úsečka CD, a to jednou.` },
    { value: cm(total + 1), why: "O centimetr víc — přepočítej druhý krok, sčítání obou délek." },
  ]), {
    hints: [
      `AB má ${a} cm. Kolik má CD, když je o ${b} cm delší? Teprve pak sečti obě.`,
      `Počítej ve dvou krocích. 1) Délka CD: k délce AB přičti ${b}. 2) Délku CD, kterou jsi dostal, sečti s AB (${a} cm). Ptáme se na obě úsečky dohromady.`,
    ],
    explanation: `Nejdřív CD: ${a} + ${b} = ${cd} cm. Pak obě dohromady: ${a} + ${cd} = ${total} cm.`,
  });
}

function dvakratDelsi(a: number): PracticeTask {
  const key = cm(2 * a);
  return choice(`Úsečka AB měří ${a} cm, CD je dvakrát delší. Kolik měří CD?`, key, tri(key, [
    { value: cm(a + 2), why: "Přičetl jsi 2. „Dvakrát delší“ ale neznamená o 2 cm víc — znamená dvakrát tolik." },
    { value: cm(3 * a), why: "To by byla úsečka třikrát delší, ne dvakrát." },
    a % 2 === 0 ? { value: cm(a / 2), why: "To je polovina — tak dlouhá by byla úsečka dvakrát kratší." } : null,
    { value: cm(a), why: "To je délka AB. CD je dvakrát delší, takže musí vyjít víc." },
  ]), {
    hints: [
      `CD je dvakrát delší než AB, která měří ${a} cm. Kolikrát vezmeš délku AB?`,
      `Dvakrát delší znamená položit AB za sebe dvakrát: ${a} cm a ještě jednou ${a} cm. Sečti je, nebo počítej ${a} × 2.`,
    ],
    explanation: `Dvakrát delší znamená dvakrát tolik: 2 × ${a} = ${a} + ${a} = ${2 * a} cm.`,
  });
}

// ── Banky parametrů (ručně vybrané tak, aby klíč nestál ve znění otázky) ────

const L1_N = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const L2_MIMO: [number, number][] = [[1, 6], [2, 9], [3, 7], [4, 12], [2, 11], [5, 13], [3, 10], [1, 9]];
const L2_SOUCET: [number, number][] = [[4, 7], [6, 8], [8, 5], [9, 6], [5, 9], [12, 4], [7, 6], [3, 11], [10, 7]];
const L2_ROZDIL: [number, number][] = [[12, 7], [9, 4], [14, 6], [11, 8], [16, 9], [13, 5], [10, 4], [18, 11]];
const L3_CAST: [number, number][] = [[15, 6], [12, 5], [18, 7], [20, 8], [14, 9], [17, 11], [13, 4], [19, 12]];
const L3_MM = [3, 4, 5, 6, 7, 8];
const L3_DVA: [number, number][] = [[4, 3], [5, 2], [6, 4], [7, 3], [3, 5], [8, 2]];
const L3_DVAKRAT = [3, 4, 6, 7, 9];

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? L1_N.map(odNuly)
    : level === 2
      ? [...L2_MIMO.map(([s, e]) => mimoNulu(s, e)), ...L2_SOUCET.map(([a, b]) => soucet(a, b)), ...L2_ROZDIL.map(([a, b]) => rozdil(a, b))]
      : [
          ...L3_CAST.map(([c, a]) => chybiCast(c, a)),
          ...L3_MM.map(naMilimetry),
          ...L3_DVA.map(([a, b]) => dvaKroky(a, b)),
          ...L3_DVAKRAT.map(dvakratDelsi),
        ];
  return shuffle(tasks);
}

export const MERIENIDELIVKYUSECKY: TopicMetadata[] = [
  {
    id: "g2-mat-mereni-delky",
    rvpNodeId:
      "g2-matematika-geometrie-v-rovine-a-v-prostoru-body-primky-usecky-mereni-delky-usecky",
    title: "Měření délky úsečky",
    studentTitle: "Jak dlouhá je čára?",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Body, přímky, úsečky",
    briefDescription: "Porovnáš délky úseček a spočítáš celkovou délku.",
    keywords: ["délka", "úsečka", "cm", "mm", "měření", "pravítko"],
    goals: [
      "Porovnat délky dvou úseček.",
      "Spočítat celkovou délku navazujících úseček.",
      "Znát vztah 1 cm = 10 mm.",
      "Řešit jednoduché slovní úlohy s délkami.",
    ],
    boundaries: ["Délky do 30 cm.", "Pouze cm a mm."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na pravítku počítej dílky mezi čárkami, ne čárky. Délky za sebou sčítej, rozdíl odečítej. 1 cm = 10 mm.",
      steps: [
        "Zjisti, kde úsečka začíná a kde končí (nebo z jakých částí se skládá).",
        "Rozhodni, jestli délky sčítáš, nebo odečítáš.",
        "Spočítej a nezapomeň na jednotku cm nebo mm.",
      ],
      commonMistake: "Když úsečka nezačíná u nuly, nestačí přečíst číslo na konci — musíš odečíst začátek.",
      example: "Úsečka začíná u 2 a končí u 9: 9 − 2 = 7, měří tedy 7 cm.",
    },
  },
];
