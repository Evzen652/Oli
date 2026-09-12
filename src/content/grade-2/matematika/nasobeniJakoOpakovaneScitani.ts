import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu): úrovně měly jen 10/10/8 úloh a jednu
// nápovědu bez zpětné vazby. Teď oddělené úrovně a každá úloha nese vlastní
// dvě nápovědy, vysvětlení a zpětnou vazbu u každé chybné možnosti.
// L1 rozpoznání zápisu (součet ↔ násobení) · L2 výpočet součinu sčítáním
// (holý příklad i slovní úloha) · L3 inverze (kolikrát sečíst) a využití
// známého výsledku (o jednu skupinu víc / míň).
//
// Konvence aplikace: a × b = číslo a sečtené b-krát (3 × 4 = 3 + 3 + 3 + 3).
// Úlohy jsou postavené tak, aby klíč platil i při opačném čtení (záměnnost).

/** Číslo jako podstatné jméno: [1. p. j. č., 4. p. j. č., 2–4, 5+]. */
const NUM: Record<number, { sg: string; acc: string; few: string; many: string }> = {
  2: { sg: "dvojka", acc: "dvojku", few: "dvojky", many: "dvojek" },
  3: { sg: "trojka", acc: "trojku", few: "trojky", many: "trojek" },
  4: { sg: "čtyřka", acc: "čtyřku", few: "čtyřky", many: "čtyřek" },
  5: { sg: "pětka", acc: "pětku", few: "pětky", many: "pětek" },
  6: { sg: "šestka", acc: "šestku", few: "šestky", many: "šestek" },
  7: { sg: "sedmička", acc: "sedmičku", few: "sedmičky", many: "sedmiček" },
  8: { sg: "osmička", acc: "osmičku", few: "osmičky", many: "osmiček" },
  9: { sg: "devítka", acc: "devítku", few: "devítky", many: "devítek" },
  10: { sg: "desítka", acc: "desítku", few: "desítky", many: "desítek" },
};

const KRAT: Record<number, string> = {
  1: "jednou", 2: "dvakrát", 3: "třikrát", 4: "čtyřikrát", 5: "pětkrát", 6: "šestkrát",
  7: "sedmkrát", 8: "osmkrát", 9: "devětkrát", 10: "desetkrát",
};

/** „a + a + … + a“ (n sčítanců). */
const rep = (a: number, n: number) => Array(n).fill(a).join(" + ");

/** n kusů čísla a jako podstatného jména („4 šestky“, „5 šestek“). */
const kusu = (n: number, a: number) => pluralWithNumber(n, NUM[a].sg, NUM[a].few, NUM[a].many);

/** První tři různé kladné kandidáty, které nejsou klíčem. */
function tri(key: number, cands: Array<[number, string]>): [Distractor, Distractor, Distractor] {
  const seen = new Set([key]);
  const out: Distractor[] = [];
  for (const [v, why] of cands) {
    if (v <= 0 || seen.has(v)) continue;
    seen.add(v);
    out.push({ value: String(v), why });
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Málo distraktorů pro klíč ${key}`);
  return out as [Distractor, Distractor, Distractor];
}

// ── L1 — rozpoznání zápisu ────────────────────────────────────────────────

/** „5 + 5 + 5 + 5 = 5 × ?“ — kolik sčítanců. */
function kolikSccitancu(a: number, n: number): PracticeTask {
  const sum = a * n;
  const d = tri(n, [
    [sum, `${sum} je výsledek součtu. Místo otazníku ale patří, kolikrát se ${NUM[a].sg} v součtu opakuje.`],
    [n >= 3 ? n - 1 : n + 1, n >= 3
      ? `Jednu ${NUM[a].acc} jsi vynechal. Spočítej sčítance znovu, jeden po druhém.`
      : `Započítal jsi o jednu ${NUM[a].acc} navíc. Spočítej sčítance znovu, jeden po druhém.`],
    [a, `${a} je číslo, které sčítáš. Místo otazníku patří, kolikrát ho sčítáš.`],
    [n + 1, `Započítal jsi o jednu ${NUM[a].acc} navíc. Spočítej sčítance znovu, jeden po druhém.`],
    [n + 2, `Započítal jsi o dvě ${NUM[a].few} navíc. Spočítej sčítance znovu, jeden po druhém.`],
  ]);
  return choice(`${rep(a, n)} = ${a} × ?`, String(n), d, {
    hints: [
      `Kolik ${NUM[a].many} sčítáš, aby vyšlo ${sum}?`,
      `Ukaž prstem postupně na každou ${NUM[a].acc} v součtu a počítej je. Kolik jich napočítáš, tolik napiš místo otazníku za ${a} ×.`,
    ],
    explanation: `${NUM[a].sg[0].toUpperCase()}${NUM[a].sg.slice(1)} se v součtu opakuje ${KRAT[n]}, proto ${rep(a, n)} = ${a} × ${n} = ${sum}.`,
  });
}

/** „Který součet se rovná 3 × 5?“ — výběr součtu. */
function kteryScitani(a: number, n: number): PracticeTask {
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${a} + ${n}`, why: `Tady jsou oba činitele jen sečtené. ${a} × ${n} znamená sčítat ${NUM[a].acc} ${KRAT[n]}.` },
    { value: rep(a, n - 1), why: `Tady je ${NUM[a].sg} jen ${KRAT[n - 1]} — o jednu méně, než říká číslo ${n}.` },
    { value: rep(a, n + 1), why: `Tady je ${NUM[a].sg} ${KRAT[n + 1]} — o jednu víc, než říká číslo ${n}.` },
  ];
  return choice(`Který součet se rovná ${a} × ${n}?`, rep(a, n), d, {
    hints: [
      `Druhé číslo v ${a} × ${n} říká, kolikrát se ${NUM[a].sg} sčítá.`,
      `V příkladu ${a} × ${n} se sčítají samé ${NUM[a].few}. U každého součtu spočítej, kolik ${NUM[a].many} v něm je, a porovnej to s číslem ${n}.`,
    ],
    explanation: `${a} × ${n} znamená sečíst ${NUM[a].acc} ${KRAT[n]}: ${rep(a, n)} = ${a * n}. (Na pořadí činitelů nezáleží: stejně vyjde i ${rep(n, a)}.)`,
  });
}

// ── L2 — výpočet sčítáním ─────────────────────────────────────────────────

function soucin(a: number, n: number): PracticeTask {
  const c = a * n;
  const d = tri(c, [
    [a + n, `Činitele ${a} a ${n} jsi sečetl. Násobení ale znamená sčítat ${NUM[a].acc} ${KRAT[n]}.`],
    [c + a, `To je o jednu ${NUM[a].acc} víc — sečetl jsi ${kusu(n + 1, a)} místo ${n}.`],
    [c - a, `To je o jednu ${NUM[a].acc} méně — sečetl jsi ${kusu(n - 1, a)} místo ${n}.`],
    [c + 1, "Jen o 1 vedle — při sčítání ses přepočítal."],
    [c - 1, "Jen o 1 vedle — při sčítání ses přepočítal."],
  ]);
  return choice(`Kolik je ${a} × ${n}? Počítej sčítáním.`, String(c), d, {
    hints: [
      `${a} × ${n} znamená sečíst ${NUM[a].acc} ${KRAT[n]}.`,
      `Piš ${NUM[a].acc} za ${NUM[a].acc}, dokud jich nebude ${n}, a průběžně sčítej: nejdřív ${a} + ${a}, pak přidej další ${NUM[a].acc}… Poslední součet je výsledek.`,
    ],
    explanation: `${rep(a, n)} = ${c}, proto ${a} × ${n} = ${c}.`,
  });
}

interface Kontext {
  /** Nádoby: [1, 2–4, 5+] v 1./4. pádě. */
  nadoba: [string, string, string];
  /** Předmět v nádobě: [1, 2–4, 5+]. */
  vec: [string, string, string];
  veta: (k: string) => string;
  otazka: string;
  zaKazdou: string;
}

const TALIRE: Kontext = {
  nadoba: ["talíř", "talíře", "talířů"],
  vec: ["jablko", "jablka", "jablek"],
  veta: (k) => `Na každém leží ${k}.`,
  otazka: "Kolik jablek je celkem?",
  zaKazdou: "za každý talíř",
};
const KRABICE: Kontext = {
  nadoba: ["krabici", "krabice", "krabic"],
  vec: ["pastelka", "pastelky", "pastelek"],
  veta: (k) => `V každé leží ${k}.`,
  otazka: "Kolik pastelek je celkem?",
  zaKazdou: "za každou krabici",
};
const LAVICE: Kontext = {
  nadoba: ["lavici", "lavice", "lavic"],
  vec: ["dítě", "děti", "dětí"],
  veta: (k) => `V každé sedí ${k}.`,
  otazka: "Kolik dětí sedí celkem?",
  zaKazdou: "za každou lavici",
};
const AUTA: Kontext = {
  nadoba: ["auto", "auta", "aut"],
  vec: ["kolo", "kola", "kol"],
  veta: (k) => `Každé má ${k}.`,
  otazka: "Kolik kol mají dohromady?",
  zaKazdou: "za každé auto",
};

function slovni(ctx: Kontext, c: number, k: number): PracticeTask {
  const total = c * k;
  const nad = (n: number) => pluralWithNumber(n, ...ctx.nadoba);
  const vec = pluralWithNumber(k, ...ctx.vec);
  const uvod = `Máme ${nad(c)}.`;
  const d = tri(total, [
    [c + k, `Sečetl jsi ${c} a ${k}. Musíš ale přičíst ${k} ${ctx.zaKazdou} zvlášť: ${k} + ${k} + …`],
    [total + k, `To je výsledek pro ${nad(c + 1)}, ne pro ${c}.`],
    [total - k, `To je výsledek pro ${nad(c - 1)}, ne pro ${c}.`],
    [total + 1, "Jen o 1 vedle — při sčítání ses přepočítal."],
    [total - 1, "Jen o 1 vedle — při sčítání ses přepočítal."],
  ]);
  return choice(`${uvod} ${ctx.veta(vec)} ${ctx.otazka}`, String(total), d, {
    hints: [
      `Přičítej ${k} ${ctx.zaKazdou} — celkem ${KRAT[c]}.`,
      `Zapiš to jako součet: ${rep(k, c)}. Sčítej postupně zleva. Ten samý součet se dá zapsat i násobením: ${k} × ${c}.`,
    ],
    explanation: `${ctx.zaKazdou[0].toUpperCase()}${ctx.zaKazdou.slice(1)} přičteš ${k}: ${rep(k, c)} = ${total}, tedy ${k} × ${c} = ${total}.`,
  });
}

// ── L3 — inverze a využití známého výsledku ───────────────────────────────

/** „Kolik trojek musíš sečíst, aby vyšlo 18?“ */
function kolikrat(a: number, n: number): PracticeTask {
  const S = a * n;
  const d = tri(n, [
    [n - 1, `Když sečteš ${kusu(n - 1, a)}, vyjde jen ${(n - 1) * a}. Ještě jedna ${NUM[a].sg} chybí.`],
    [n + 1, `Když sečteš ${kusu(n + 1, a)}, vyjde ${(n + 1) * a}. To je víc než ${S}.`],
    [a, `${a} je číslo, které sčítáš. Ptáme se, kolikrát ho sčítáš.`],
    [S - a, `To je ${S} − ${a}. Nestačí odečíst jednu ${NUM[a].acc} — musíš zjistit, kolik ${NUM[a].many} dá dohromady ${S}.`],
    [n + 2, `Když sečteš ${kusu(n + 2, a)}, vyjde ${(n + 2) * a}. To je moc.`],
  ]);
  return choice(`Kolik ${NUM[a].many} musíš sečíst, aby vyšlo ${S}?`, String(n), d, {
    hints: [
      `Přičítej ${NUM[a].acc} znovu a znovu, dokud nedojdeš k ${S}.`,
      `Začni od nuly a pokaždé přidej ${a}. Při každém přičtení zvedni jeden prst. Až dojdeš přesně na ${S}, spočítej zvednuté prsty.`,
    ],
    explanation: `${rep(a, n)} = ${S}. ${NUM[a].sg[0].toUpperCase()}${NUM[a].sg.slice(1)} se sčítá ${KRAT[n]}, proto ${a} × ${n} = ${S}.`,
  });
}

/** „Víš, že 6 × 4 = 24. Kolik je 6 × 5?“ — o jeden sčítanec víc / míň. */
function znamy(a: number, nK: number, nA: number): PracticeTask {
  const K = a * nK;
  const key = a * nA;
  const vic = nA > nK;
  const sg = vic ? 1 : -1;
  const d = tri(key, [
    [K + sg, `Změnil jsi výsledek jen o 1. Když ${vic ? "přibude" : "ubude"} jedna ${NUM[a].sg}, výsledek se ${vic ? "zvětší" : "zmenší"} o ${a}.`],
    [K + sg * nA, `${vic ? "Přičetl" : "Odečetl"} jsi ${nA}. ${vic ? "Přibyla" : "Ubyla"} ale jedna ${NUM[a].sg}, tedy ${a}.`],
    [K + sg * 2 * a, `To je o dvě ${NUM[a].few} ${vic ? "víc" : "méně"}. Rozdíl je jen jedna ${NUM[a].sg}.`],
    [K, `To je výsledek příkladu ${a} × ${nK}. Ptáme se na ${a} × ${nA}.`],
  ]);
  return choice(`Víš, že ${a} × ${nK} = ${K}. Kolik je ${a} × ${nA}?`, String(key), d, {
    hints: [
      `Porovnej ${a} × ${nK} a ${a} × ${nA}: o kolik ${NUM[a].many} se liší?`,
      `${a} × ${nA} je o jednu ${NUM[a].acc} ${vic ? "víc" : "méně"} než ${a} × ${nK}. Nepočítej od začátku — ke známému výsledku ${K} jednu ${NUM[a].acc} ${vic ? "přičti" : "odečti"}.`,
    ],
    explanation: `${a} × ${nA} znamená sečíst ${NUM[a].acc} ${KRAT[nA]}, to je o jednu ${NUM[a].acc} ${vic ? "víc" : "méně"} než ${KRAT[nK]}. Proto ${K} ${vic ? "+" : "−"} ${a} = ${key}.`,
  });
}

// ── Banky úrovní ──────────────────────────────────────────────────────────

const L1_POCET: [number, number][] = [
  [2, 3], [2, 5], [3, 4], [3, 2], [4, 3], [4, 5], [5, 2], [5, 4], [6, 3], [7, 2], [8, 3], [10, 4], [9, 2],
];
const L1_SOUCET: [number, number][] = [[2, 4], [3, 5], [4, 3], [5, 4], [6, 3], [2, 5]];

const L2_SOUCIN: [number, number][] = [[4, 6], [3, 7], [6, 4], [2, 8], [7, 3], [8, 4], [9, 3], [5, 6]];
const L2_SLOVNI: [Kontext, number, number][] = [
  [TALIRE, 3, 4], [TALIRE, 4, 5], [KRABICE, 4, 6], [KRABICE, 3, 8],
  [LAVICE, 6, 2], [LAVICE, 5, 3], [AUTA, 3, 4], [AUTA, 5, 4],
];

const L3_KOLIKRAT: [number, number][] = [
  [3, 6], [4, 5], [2, 7], [5, 6], [6, 3], [4, 7], [7, 4], [10, 4], [3, 8], [2, 9],
];
const L3_ZNAMY: [number, number, number][] = [
  [6, 4, 5], [5, 6, 7], [7, 3, 4], [4, 8, 9], [9, 4, 3], [8, 5, 4], [3, 9, 8],
];

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? [...L1_POCET.map(([a, n]) => kolikSccitancu(a, n)), ...L1_SOUCET.map(([a, n]) => kteryScitani(a, n))]
    : level === 2
      ? [...L2_SOUCIN.map(([a, n]) => soucin(a, n)), ...L2_SLOVNI.map(([ctx, c, k]) => slovni(ctx, c, k))]
      : [...L3_KOLIKRAT.map(([a, n]) => kolikrat(a, n)), ...L3_ZNAMY.map(([a, k, n]) => znamy(a, k, n))];
  return shuffle(tasks);
}

export const NASOBENIJAKO_OPAKOVANE_SCITANI: TopicMetadata[] = [
  {
    id: "g2-mat-nasobeni-opakovane",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-nasobeni-a-deleni-nasobeni-jako-opakovane-scitani",
    title: "Násobení jako opakované sčítání",
    studentTitle: "Násobení = sčítání",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Násobení a dělení",
    briefDescription: "Pochopíš, že násobení je opakované sčítání.",
    keywords: ["násobení", "opakované sčítání", "krát", "součin"],
    goals: [
      "Vysvětlit násobení jako opakované sčítání.",
      "Převést sčítání na zápis násobení.",
      "Spočítat jednoduchý součin přes sčítání.",
    ],
    boundaries: ["Násobitele do 10.", "Bez násobilky zpaměti — stačí sčítání."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Násobení = počítáš, kolikrát přičítáš stejné číslo.",
      steps: [
        "3 × 4 znamená: přičti 3 celkem 4krát.",
        "3 + 3 + 3 + 3 = 12",
        "Takže 3 × 4 = 12.",
      ],
      commonMistake: "Záměna pořadí: 3 × 4 a 4 × 3 dají stejný výsledek.",
      example: "2 + 2 + 2 = 2 × 3 = 6.",
    },
  },
];
