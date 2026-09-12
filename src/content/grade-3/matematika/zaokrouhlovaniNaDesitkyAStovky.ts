import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, pick, type Distractor } from "../_shared";

// Upraveno 2026-09-11 (inventura obsahu): L1 a L2 byly totožné (obě jen na
// desítky), L1 generovala už zaokrouhlená čísla (320 na desítky = 320, klíč
// ve znění), nápověda byla stejná pro všechny úlohy a chybné možnosti neměly
// zpětnou vazbu. Teď:
// L1 na desítky, jasné případy (jednotky 1–4 nebo 6–9, bez přechodu přes stovku).
// L2 na stovky + hraniční případy na desítky (jednotky 5, přechod přes stovku).
// L3 transfer: past postupného zaokrouhlení (347 → 300, ne 400), odhad součtu
//    a rozdílu zaokrouhlením a zaokrouhlení téhož čísla na desítky i stovky.

function roundTo(n: number, to: number): number {
  return Math.round(n / to) * to;
}

function rnd(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

type Rad = 10 | 100;
const NA = { 10: "desítky", 100: "stovky" } as const;
const PODLE = { 10: "jednotek", 100: "desítek" } as const;
const cislice = (n: number, to: Rad) => (to === 10 ? n % 10 : Math.floor(n / 10) % 10);

/** Tři různé chybné možnosti v oboru 0–1000, odlišné od klíče (dedup po vygenerování). */
function tri(correct: string, kandidati: Distractor[]): [Distractor, Distractor, Distractor] {
  const seen = new Set([correct]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    const v = Number(k.value.split(" ")[0]);
    if (seen.has(k.value) || v < 0 || v > 1000) continue;
    seen.add(k.value);
    out.push(k);
    if (out.length === 3) return out as [Distractor, Distractor, Distractor];
  }
  throw new Error(`Málo chybných možností pro klíč ${correct}`);
}

/** Zaokrouhli n na desítky/stovky; `past` = číslo s číslicí desítek 4 a jednotkami ≥ 5. */
function zaokrouhli(n: number, to: Rad, past = false): PracticeTask {
  const c = roundTo(n, to);
  const down = Math.floor(n / to) * to;
  const up = down + to;
  const dig = cislice(n, to);
  const nahoru = dig >= 5;
  const jiny: Rad = to === 10 ? 100 : 10;
  const kandidati: Distractor[] = [];
  if (past) {
    kandidati.push({
      value: String(up),
      why: `Tady se zaokrouhlovalo postupně: nejdřív na ${roundTo(n, 10)}, pak na stovky. Tak se to nedělá — rozhoduje jen číslice desítek, a ta je ${dig}.`,
    });
  }
  kandidati.push(
    {
      value: String(nahoru ? down : up),
      why: nahoru
        ? `Číslice ${PODLE[to]} je ${dig}, tedy 5 nebo víc — zaokrouhluje se nahoru, ne dolů.`
        : `Číslice ${PODLE[to]} je ${dig}, to je méně než 5 — zaokrouhluje se dolů, ne nahoru.`,
    },
    { value: String(roundTo(n, jiny)), why: `To je zaokrouhlení na ${NA[jiny]}. Tady se zaokrouhluje na ${NA[to]}.` },
    {
      value: String(nahoru ? up + to : down - to),
      why: `Číslo ${n} leží mezi ${down} a ${up}. Zaokrouhlený výsledek musí být jedno z těchto dvou čísel.`,
    },
    { value: String(n), why: `Číslo zůstalo beze změny. Číslo zaokrouhlené na ${NA[to]} končí ${to === 10 ? "nulou" : "dvěma nulami"}.` },
    {
      value: String(nahoru ? down - to : up + to),
      why: `Číslo ${n} leží mezi ${down} a ${up}. Zaokrouhlený výsledek musí být jedno z těchto dvou čísel.`,
    },
  );
  const h0 = past
    ? `Pozor, u čísla ${n} rozhoduje při zaokrouhlení na stovky jediná číslice. Která?`
    : `U čísla ${n} se při zaokrouhlení na ${NA[to]} podívej na číslici ${PODLE[to]}.`;
  const h1 = `Číslice ${PODLE[to]} v čísle ${n} rozhodne: 0 až 4 znamená dolů, 5 až 9 nahoru. `
    + (to === 10
      ? "Při zaokrouhlení dolů se jednotky změní na nulu, při zaokrouhlení nahoru přibude jedna desítka."
      : "Při zaokrouhlení dolů se desítky i jednotky změní na nuly, při zaokrouhlení nahoru přibude jedna stovka.")
    + (past ? " Nezaokrouhluj postupně přes desítky, jednotky tu nehrají roli." : "");
  return choice(`Zaokrouhli číslo ${n} na ${NA[to]}.`, String(c), tri(String(c), kandidati), {
    hints: [h0, h1],
    explanation: `${n} leží mezi ${down} a ${up}. Číslice ${PODLE[to]} je ${dig}, `
      + (nahoru ? `tedy 5 nebo víc, a proto zaokrouhlujeme nahoru na ${c}.` : `to je méně než 5, a proto zaokrouhlujeme dolů na ${c}.`)
      + (past ? ` Jednotky (${n % 10}) se při zaokrouhlení na stovky vůbec nepočítají.` : ""),
  });
}

/** Odhad výsledku: obě čísla zaokrouhli, pak počítej (transfer do počítání). */
function odhad(to: Rad, plus: boolean): PracticeTask {
  let a: number, b: number;
  for (;;) {
    a = rnd(111, 899); b = rnd(111, 899);
    if (a % to === 0 || b % to === 0 || a % 10 === 0 || b % 10 === 0) continue;
    const est0 = plus ? roundTo(a, to) + roundTo(b, to) : roundTo(a, to) - roundTo(b, to);
    // Odhad i chybné možnosti musí zůstat v oboru 0–1000.
    if (plus ? a + b > 999 || est0 > 800 : a - b < 100 || est0 < 200) continue;
    break;
  }
  const ra = roundTo(a, to), rb = roundTo(b, to);
  const oa = cislice(a, to) >= 5 ? ra - to : ra + to;
  const ob = cislice(b, to) >= 5 ? rb - to : rb + to;
  const zn = plus ? "+" : "−";
  const calc = (x: number, y: number) => (plus ? x + y : x - y);
  const est = calc(ra, rb);
  const exact = calc(a, b);
  const jiny: Rad = to === 10 ? 100 : 10;
  const kandidati: Distractor[] = [
    { value: String(exact), why: "To je přesný výsledek. Odhad se počítá se zaokrouhlenými čísly." },
    { value: String(calc(oa, rb)), why: `${a} se na ${NA[to]} zaokrouhlí na ${ra}, ne na ${oa}: číslice ${PODLE[to]} je ${cislice(a, to)}.` },
    { value: String(calc(ra, ob)), why: `${b} se na ${NA[to]} zaokrouhlí na ${rb}, ne na ${ob}: číslice ${PODLE[to]} je ${cislice(b, to)}.` },
    { value: String(calc(roundTo(a, jiny), roundTo(b, jiny))), why: `Čísla se zaokrouhlila na ${NA[jiny]}. Úloha chce zaokrouhlení na ${NA[to]}.` },
    { value: String(est + to), why: `Zaokrouhlená čísla jsou ${ra} a ${rb}, spočítej s nimi znovu.` },
    { value: String(est - to), why: `Zaokrouhlená čísla jsou ${ra} a ${rb}, spočítej s nimi znovu.` },
    { value: String(est + 2 * to), why: `Odhad je o ${2 * to} vedle. Zaokrouhli ${a} na ${ra} a ${b} na ${rb} a počítej s nimi.` },
  ];
  return choice(
    `Odhadni ${plus ? "součet" : "rozdíl"} ${a} ${zn} ${b}: obě čísla zaokrouhli na ${NA[to]} a pak počítej.`,
    String(est), tri(String(est), kandidati), {
      hints: [
        `Zaokrouhli nejdřív čísla ${a} a ${b} na ${NA[to]}.`,
        `U čísla ${a} rozhoduje číslice ${PODLE[to]} ${cislice(a, to)}, u čísla ${b} číslice ${cislice(b, to)}. Se zaokrouhlenými čísly pak ${plus ? "sečti" : "odečti"} — půjde to snadno zpaměti.`,
      ],
      explanation: `${a} se zaokrouhlí na ${ra} a ${b} na ${rb}. Odhad: ${ra} ${zn} ${rb} = ${est}. `
        + (exact === est ? "Tady vyšel odhad dokonce stejně jako přesný výsledek." : `Přesný výsledek ${exact} je opravdu blízko.`),
    });
}

/** Totéž číslo na desítky i na stovky — obě zaokrouhlení z původního čísla. */
function oboji(): PracticeTask {
  let n: number;
  do n = rnd(101, 989); while (n % 10 === 0 || n % 100 < 10);
  const t = Math.floor(n / 10) % 10, u = n % 10;
  const c10 = roundTo(n, 10), c100 = roundTo(n, 100);
  const o10 = u >= 5 ? c10 - 10 : c10 + 10;
  const o100 = t >= 5 ? c100 - 100 : c100 + 100;
  const post = roundTo(c10, 100);
  const kandidati: Distractor[] = [];
  if (post !== c100) {
    kandidati.push({ value: `${c10} a ${post}`, why: `Na stovky se zaokrouhlovalo až z ${c10}. Správně se zaokrouhluje z původního čísla ${n}, kde je číslice desítek ${t}.` });
  }
  kandidati.push(
    { value: `${o10} a ${c100}`, why: `Na desítky je to špatně: číslice jednotek je ${u}, a proto se zaokrouhluje ${u >= 5 ? "nahoru" : "dolů"}.` },
    { value: `${c10} a ${o100}`, why: `Na stovky je to špatně: číslice desítek je ${t}, a proto se zaokrouhluje ${t >= 5 ? "nahoru" : "dolů"}.` },
    { value: `${o10} a ${o100}`, why: `Obě zaokrouhlení jdou opačným směrem. Rozhoduje číslice jednotek (${u}) a číslice desítek (${t}).` },
  );
  const correct = `${c10} a ${c100}`;
  return choice(`Zaokrouhli číslo ${n} na desítky i na stovky.`, correct, tri(correct, kandidati), {
    hints: [
      `Číslo ${n} zaokrouhli dvakrát: jednou podle číslice jednotek, jednou podle číslice desítek.`,
      `Na desítky rozhoduje číslice jednotek (${u}), na stovky číslice desítek (${t}). Obě zaokrouhlení dělej z původního čísla ${n}, ne jedno z druhého.`,
    ],
    explanation: `Na desítky: číslice jednotek je ${u}, proto ${u >= 5 ? "nahoru" : "dolů"} na ${c10}. Na stovky: číslice desítek je ${t}, proto ${t >= 5 ? "nahoru" : "dolů"} na ${c100}.`,
  });
}

// ── Pooly úrovní ────────────────────────────────────────────────────────────

function cisloL1(): number {
  // na desítky: jednotky 1–4 nebo 6–9, desítky 0–8 (bez přechodu přes stovku)
  return rnd(1, 9) * 100 + rnd(0, 8) * 10 + pick([1, 2, 3, 4, 6, 7, 8, 9]);
}

function ulohaL2(): PracticeTask {
  if (Math.random() < 0.6) {
    let n: number;
    do n = rnd(101, 999);
    while (n % 100 === 0 || (Math.floor(n / 10) % 10 === 4 && n % 10 >= 5));
    return zaokrouhli(n, 100);
  }
  // hraniční případy na desítky: jednotky 5, nebo přechod přes celou stovku
  const n = Math.random() < 0.5
    ? rnd(1, 9) * 100 + rnd(0, 9) * 10 + 5
    : rnd(1, 9) * 100 + 90 + rnd(6, 9);
  return zaokrouhli(n, 10);
}

function ulohaL3(i: number): PracticeTask {
  switch (i % 4) {
    case 0: return zaokrouhli(rnd(1, 9) * 100 + 40 + rnd(5, 9), 100, true);
    case 1: return odhad(100, true);
    case 2: return odhad(10, false);
    default: return oboji();
  }
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? zaokrouhli(cisloL1(), 10) : level === 2 ? ulohaL2() : ulohaL3(i));
  }
  return shuffle(tasks);
}

export const ZAOKROUHLOVANINADESITKYASTOVKY: TopicMetadata[] = [
  {
    id: "g3-mat-zaokrouhlovani",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-zaokrouhlovani-na-desitky-a-stovky",
    title: "Zaokrouhlování na desítky a stovky",
    studentTitle: "Zaokrouhlování",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Naučíš se zaokrouhlovat čísla na desítky a stovky.",
    keywords: ["zaokrouhlování", "desítky", "stovky", "nahoru", "dolů", "odhad"],
    goals: [
      "Zaokrouhlit číslo na desítky.",
      "Zaokrouhlit číslo na stovky.",
      "Použít pravidlo: číslice ≥ 5 → nahoru, < 5 → dolů.",
    ],
    boundaries: ["Čísla do 1000.", "Nezahrnuje zaokrouhlování na tisíce."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se na číslici hned za tím řádem, na který zaokrouhlujeme. Je-li 5 nebo víc → přidáme 1. Je-li méně než 5 → necháme.",
      steps: [
        "Na desítky: dívej se na číslici jednotek.",
        "Na stovky: dívej se na číslici desítek.",
        "Číslice ≥ 5 → zaokrouhlujeme nahoru.",
        "Číslice < 5 → zaokrouhlujeme dolů (nižší číslice dáme nulu).",
      ],
      commonMistake: "Číslo 450 zaokrouhlené na stovky je 500 (číslice desítek = 5 ≥ 5 → nahoru), ne 400.",
      example: "376 na desítky: číslice jednotek = 6 ≥ 5 → 380. Na stovky: číslice desítek = 7 ≥ 5 → 400.",
    },
  },
];
