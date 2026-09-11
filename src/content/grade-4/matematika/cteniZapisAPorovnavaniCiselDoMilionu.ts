import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fmt, rnd, shuffle, RADY_2P } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Převod čísla na slova byl
// chybný („jednastotisíc“, „dvědesettisíc“, tisíce bez skloňování), úlohy
// na řády mohly mít méně než čtyři možnosti a L3 jen míchala L1. Teď:
// L1: porovnání čísel do 99 999 (hlavně stejně dlouhých)
// L2: hodnota číslice v daném řádu (do 999 999)
// L3: zápis čísla slovy ↔ číslicemi, typické chyby s nulami.

const JEDN = ["", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
const JEDN_M = ["", "jeden", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
const NACT = ["deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
const DES = ["", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
const STA = ["", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];

function doTisice(n: number, muz: boolean): string {
  const h = Math.floor(n / 100), t = n % 100;
  const parts: string[] = [];
  if (h) parts.push(STA[h]);
  if (t >= 10 && t < 20) parts.push(NACT[t - 10]);
  else {
    if (t >= 20) parts.push(DES[Math.floor(t / 10)]);
    if (t % 10) parts.push((muz ? JEDN_M : JEDN)[t % 10]);
  }
  return parts.join(" ");
}

/** Slovní zápis čísla 1 000–999 999 (tisíce se skloňují: dva tisíce, pět tisíc, dvacet jeden tisíc). */
export function slovy(n: number): string {
  const T = Math.floor(n / 1000), R = n % 1000;
  const posl = T % 100;
  const tvar = (posl % 10 >= 2 && posl % 10 <= 4 && (posl < 10 || posl > 20)) ? "tisíce" : "tisíc";
  const tisice = T === 1 ? "tisíc" : `${doTisice(T, true)} ${tvar}`;
  return R ? `${tisice} ${doTisice(R, false)}` : tisice;
}

function porovnani(): PracticeTask {
  const a = rnd(10000, 99999);
  let b: number;
  const r = Math.random();
  if (r < 0.6) {
    const pos = rnd(0, 3);
    const s = String(a).split("");
    let nd = rnd(0, 9);
    while (nd === Number(s[pos]) || (pos === 0 && nd === 0)) nd = rnd(0, 9);
    s[pos] = String(nd);
    b = Number(s.join(""));
  } else if (r < 0.9) b = rnd(1000, 9999);
  else b = a;
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  const key = x > y ? ">" : x < y ? "<" : "=";
  const sx = String(x), sy = String(y);
  let rad = "";
  if (sx.length === sy.length && x !== y) {
    const i = [...sx].findIndex((c, k) => c !== sy[k]);
    rad = RADY_2P[sx.length - 1 - i];
  }
  const proc = x === y
    ? "Čísla jsou úplně stejná."
    : sx.length !== sy.length
      ? `Číslo ${fmt(Math.max(x, y))} má víc číslic, proto je větší.`
      : `Čísla se poprvé liší v řádu ${rad}: tam má ${fmt(Math.max(x, y))} větší číslici.`;
  const optionFeedback: Record<string, string> = {};
  for (const o of [">", "<", "="]) if (o !== key) optionFeedback[o] = o === "=" ? `Čísla stejná nejsou. ${proc}` : proc;
  return {
    question: `Porovnej čísla: ${fmt(x)} ○ ${fmt(y)}`,
    correctAnswer: key,
    options: [">", "<", "="],
    optionFeedback,
    hints: [
      `Spočítej, kolik číslic má ${fmt(x)} a kolik ${fmt(y)}.`,
      `Když je počet číslic stejný, porovnávej zleva řád po řádu. Rozhodne první místo, kde se čísla liší${rad ? ` — hledej v řádu ${rad}` : ""}.`,
    ],
    solutionSteps: [
      `${fmt(x)} a ${fmt(y)}: ${sx.length === sy.length ? "stejný počet číslic, porovnáme zleva." : "různý počet číslic."}`,
      proc,
      `Proto ${fmt(x)} ${key} ${fmt(y)}.`,
    ],
  };
}

function rad(): PracticeTask {
  const cifry = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
  if (cifry[0] === 0) [cifry[0], cifry[1]] = [cifry[1], cifry[0]];
  const n = Number(cifry.join(""));
  const idx = rnd(0, 5); // 0 = stotisíce … 5 = jednotky
  const nazev = RADY_2P[5 - idx];
  const key = cifry[idx];
  const ostatni = shuffle([0, 1, 2, 3, 4, 5].filter((i) => i !== idx)).slice(0, 3);
  const PORADI = ["první", "druhá", "třetí", "čtvrtá", "pátá", "šestá"];
  return ciselnaUloha(`V čísle ${fmt(n)} je na místě ${nazev} číslice…`, key,
    ostatni.map((i) => ({ value: cifry[i], why: `Číslice ${cifry[i]} je na místě ${RADY_2P[5 - i]}.` })), [
      `V čísle ${fmt(n)} počítej řády zprava: jednotky, desítky, stovky, tisíce…`,
      `Místo ${nazev} je ${PORADI[5 - idx]} číslice zprava. U čísla ${fmt(n)} jdi od poslední číslice doleva a počítej místa, dokud nedojdeš na to správné — číslice, na které se zastavíš, je odpověď.`,
    ], [
      `Řády zprava: ${cifry.slice().reverse().map((c, i) => `${RADY_2P[i]} ${c}`).join(", ")}.`,
      `Na místě ${nazev} je číslice ${key}.`,
    ]);
}

function zapisCislem(): PracticeTask {
  const T = rnd(100, 999);
  const R = Math.random() < 0.6 ? rnd(1, 99) : rnd(100, 999);
  const n = T * 1000 + R;
  const chyby = [
    ...(R < 100 ? [{ value: fmt(T * 1000 + R * 10), why: "Za tisíci musí následovat tři číslice. Když je stovek 0, napiš nulu na místo stovek." }] : []),
    ...(R < 10 ? [{ value: fmt(T * 1000 + R * 100), why: "Chybí nuly na místě stovek a desítek." }] : []),
    { value: fmt(T * 100 + (R % 100)), why: "Chybí jedna číslice — číslo do milionu s tisíci má šest číslic." },
    { value: fmt(n + 10000), why: "Nesedí řád desetitisíců — přečti znovu, kolik je tisíců." },
    { value: fmt(n - 1000), why: "Nesedí řád tisíců — přečti znovu, kolik je tisíců." },
  ];
  return ciselnaUloha(`Zapiš číslicemi: „${slovy(n)}“`, fmt(n), chyby, [
    `Kolik je tisíců v čísle „${slovy(n)}“? A kolik zbývá za tisíci?`,
    `Nejdřív zapiš počet tisíců (${fmt(T)}). Za něj patří vždy přesně tři číslice — stovky, desítky, jednotky. Kde nějaký řád chybí, napiš 0.`,
  ], [
    `„${slovy(n)}“ = ${fmt(T)} tisíc a ${R}.`,
    `Tisíce: ${fmt(T)}, za ně tři číslice: ${String(R).padStart(3, "0")}.`,
    `Zápis: ${fmt(n)}`,
  ]);
}

function zapisSlovy(): PracticeTask {
  const T = rnd(100, 999);
  const R = rnd(1, 999);
  const n = T * 1000 + R;
  const klic = slovy(n);
  const obal = (s: string) => ` ${s} `;
  // Distraktor nesmí být celou frází v klíči ani naopak („… šest set“ × „… šest set jedna“).
  const chyby = [
    { value: slovy(T * 1000 + ((R % 10) * 10 + Math.floor((R % 100) / 10)) + Math.floor(R / 100) * 100), why: "Desítky a jednotky jsou přehozené." },
    { value: slovy((T + 1) * 1000 + R), why: "Nesedí počet tisíců — je o jeden větší." },
    { value: slovy(T * 1000 + ((R + 100) % 1000 || 100)), why: "Nesedí počet stovek za tisíci." },
    { value: slovy(T * 1000 + (R % 100 === 0 ? R + 1 : R - 1)), why: "Nesedí jednotky." },
    { value: slovy((T - 1) * 1000 + R), why: "Nesedí počet tisíců — je o jeden menší." },
  ].filter((c) => !obal(c.value).includes(obal(klic)) && !obal(klic).includes(obal(c.value)));
  return ciselnaUloha(`Jak se čte číslo ${fmt(n)}?`, klic, chyby, [
    `Rozděl číslo ${fmt(n)} na tisíce a zbytek.`,
    `Nejdřív přečti trojici před mezerou a přidej „tisíc“ (nebo „tisíce“), pak přečti poslední tři číslice: ${String(R).padStart(3, "0")}.`,
  ], [
    `${fmt(n)} = ${fmt(T)} tisíc a ${R}.`,
    `Čteme: ${slovy(n)}.`,
  ]);
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 40; i++) {
    if (level === 1) tasks.push(porovnani());
    else if (level === 2) tasks.push(rad());
    else tasks.push(i % 2 ? zapisCislem() : zapisSlovy());
  }
  return tasks;
}

export const CTENI_ZAPIS_POROVNAVANI: TopicMetadata[] = [
  {
    id: "g4-mat-cisla-do-milionu-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1-000-000-cteni-zapis-a-porovnavani-cisel-do-milionu",
    displayName: "Čísla do milionu",
    title: "Čtení, zápis a porovnávání čísel do milionu",
    studentTitle: "Velká čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1 000 000",
    briefDescription: "Naučíš se číst a porovnávat čísla až do milionu.",
    keywords: [
      "čísla do milionu", "porovnávání čísel", "číselný zápis",
      "řády čísel", "stotisíce", "desetitisíce", "tisíce",
    ],
    goals: [
      "Přečíst a zapsat číslo do 1 000 000.",
      "Určit hodnotu číslice na daném místě (řádu).",
      "Porovnat dvě čísla pomocí <, >, =.",
    ],
    boundaries: [
      "Pouze přirozená čísla (celá, nezáporná).",
      "Nezahrnuje záporná čísla ani desetinná čísla.",
      "Rozsah: 0 až 1 000 000.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-zaokrouhlovani-4", "g4-mat-pisemne-scitani-odcitani-4"],
    generator: gen,
    helpTemplate: {
      hint: "Porovnávej čísla od nejvyššího řádu zleva. Číslo s větší číslicí na prvním odlišném místě je větší.",
      steps: [
        "Zapiš obě čísla pod sebe (zarovnej řády).",
        "Porovnej od nejvyšší číslice vlevo.",
        "Najdi první místo, kde se číslice liší — větší číslice = větší číslo.",
        "Pokud jsou všechny číslice stejné → čísla jsou rovná.",
      ],
      commonMistake: "Porovnávání délky číslic bez ohledu na hodnotu — 9 999 vs 10 000: kratší (4 cifry) vs delší (5 číslic).",
      example: "456 789 > 456 700 (liší se na místě desítek: 8 > 0).",
    },
  },
];
