import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, rnd, shuffle } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Úlohy téhož typu měly stejnou
// nápovědu, chybné možnosti byly jen ±1, ±2, ±5 bez vysvětlení a čtení
// hodnoty z tabulky mělo klíč přímo v zadání. Teď se vedle tabulky čte
// i sloupcový diagram ze čtverečků ■, kde jeden čtvereček znamená víc kusů
// (typická chyba: spočítat čtverečky a zapomenout na měřítko).
// L1 součet v tabulce, diagram „■ = dva“ · L2 největší/nejmenší, diagram „■ = pět“
// L3 rozdíly v tabulce i v diagramu.
// Řádky tabulky začínají „•“: jinak by kontrola gramatiky četla „3⏎Březen“ jako „3 Březen“.

interface Dataset {
  nazev: string;
  polozky: string[];
  /** Tvar položky do otázky („jablka“, „v lednu“, „autobusem“). */
  tvar: string[];
  min: number;
  max: number;
  dva: string;
  pet: string;
  celkem: string;
  kolik: (t: string) => string;
  oKolik: (x: string, y: string) => string;
  nejvic: string;
  nejmin: string;
}

const DATA: Dataset[] = [
  {
    nazev: "Oblíbené ovoce ve třídě", polozky: ["Jablka", "Banány", "Pomeranče", "Jahody"],
    tvar: ["jablka", "banány", "pomeranče", "jahody"], min: 3, max: 20, dva: "dva žáky", pet: "pět žáků",
    celkem: "Kolik žáků hlasovalo celkem?",
    kolik: (t) => `Kolik žáků má nejraději ${t}?`,
    oKolik: (x, y) => `O kolik víc žáků má nejraději ${x} než ${y}?`,
    nejvic: "Které ovoce má nejraději nejvíc žáků?", nejmin: "Které ovoce má nejraději nejméně žáků?",
  },
  {
    nazev: "Přečtené knihy ve třídě", polozky: ["Leden", "Únor", "Březen", "Duben"],
    tvar: ["v lednu", "v únoru", "v březnu", "v dubnu"], min: 2, max: 15, dva: "dvě knihy", pet: "pět knih",
    celkem: "Kolik knih přečetla třída za všechny čtyři měsíce?",
    kolik: (t) => `Kolik knih přečetla třída ${t}?`,
    oKolik: (x, y) => `O kolik víc knih přečetla třída ${x} než ${y}?`,
    nejvic: "Ve kterém měsíci přečetla třída nejvíc knih?", nejmin: "Ve kterém měsíci přečetla třída nejméně knih?",
  },
  {
    nazev: "Jak se žáci dostanou do školy", polozky: ["Pěšky", "Autobusem", "Autem", "Na kole"],
    tvar: ["pěšky", "autobusem", "autem", "na kole"], min: 2, max: 25, dva: "dva žáky", pet: "pět žáků",
    celkem: "Kolik žáků je to celkem?",
    kolik: (t) => `Kolik žáků se dostane do školy ${t}?`,
    oKolik: (x, y) => `O kolik víc žáků se dostane do školy ${x} než ${y}?`,
    nejvic: "Jak se do školy dostane nejvíc žáků?", nejmin: "Jak se do školy dostane nejméně žáků?",
  },
  {
    nazev: "Prodané vstupenky na koncert", polozky: ["Pondělí", "Úterý", "Středa", "Čtvrtek"],
    tvar: ["v pondělí", "v úterý", "ve středu", "ve čtvrtek"], min: 5, max: 40, dva: "dvě vstupenky", pet: "pět vstupenek",
    celkem: "Kolik vstupenek se prodalo za všechny čtyři dny?",
    kolik: (t) => `Kolik vstupenek se prodalo ${t}?`,
    oKolik: (x, y) => `O kolik víc vstupenek se prodalo ${x} než ${y}?`,
    nejvic: "Ve který den se prodalo nejvíc vstupenek?", nejmin: "Ve který den se prodalo nejméně vstupenek?",
  },
];

const nahodny = () => DATA[rnd(0, DATA.length - 1)];

/** Čtyři různé hodnoty — maximum i minimum jsou tak jednoznačné. */
function hodnoty(min: number, max: number): number[] {
  for (;;) {
    const v = [0, 1, 2, 3].map(() => rnd(min, max));
    if (new Set(v).size === 4) return v;
  }
}

const tabulka = (ds: Dataset, v: number[]) =>
  `Tabulka „${ds.nazev}“:\n${ds.polozky.map((p, i) => `• ${p}: ${v[i]}`).join("\n")}`;

const diagram = (ds: Dataset, k: number[], m: 2 | 5) =>
  `Diagram „${ds.nazev}“ — jeden čtvereček ■ znamená ${m === 2 ? ds.dva : ds.pet}:\n${ds.polozky.map((p, i) => `${p}: ${"■".repeat(k[i])}`).join("\n")}`;

function soucet(): PracticeTask {
  const ds = nahodny();
  const v = hodnoty(ds.min, ds.max);
  const s = v.reduce((a, b) => a + b, 0);
  return ciselnaUloha(`${tabulka(ds, v)}\n${ds.celkem}`, s, [
    { value: s - v[3], why: `Vynechal se řádek „${ds.polozky[3]}“ (${v[3]}).` },
    { value: s - v[0], why: `Vynechal se řádek „${ds.polozky[0]}“ (${v[0]}).` },
    { value: s + v[1], why: `Řádek „${ds.polozky[1]}“ (${v[1]}) se započítal dvakrát.` },
  ], [
    `Sečti všechna čtyři čísla z tabulky „${ds.nazev}“: ${v.join(" + ")}.`,
    `Sčítej po dvojicích: nejdřív ${v[0]} + ${v[1]}, pak ${v[2]} + ${v[3]} a nakonec sečti oba mezisoučty. Na konci zkontroluj, že jsi do součtu vzal všechny čtyři řádky tabulky „${ds.nazev}“ a žádný nepočítal dvakrát.`,
  ], [`${v.join(" + ")} = ${s}`]);
}

function cteniDiagramu(m: 2 | 5): PracticeTask {
  const ds = nahodny();
  const k = hodnoty(1, 8);
  const i = rnd(0, 3), j = (i + 1) % 4;
  const klic = k[i] * m;
  const znamena = m === 2 ? ds.dva : ds.pet;
  const nasob = m === 2 ? "dvěma" : "pěti";
  const po = m === 2 ? "dvou" : "pěti";
  const prehled = ds.polozky.map((p, x) => `„${p}“ ${"■".repeat(k[x])}`).join(", ");
  return ciselnaUloha(`${diagram(ds, k, m)}\n${ds.kolik(ds.tvar[i])}`, klic, [
    { value: k[i], why: `${k[i]} je počet čtverečků v řádku „${ds.polozky[i]}“. Jeden čtvereček ale znamená ${znamena}.` },
    { value: klic + m, why: `Tolik by vyšlo, kdyby měl řádek „${ds.polozky[i]}“ o jeden čtvereček víc. Spočítej je znovu.` },
    { value: klic - m, why: `Tolik by vyšlo, kdyby měl řádek „${ds.polozky[i]}“ o jeden čtvereček méně. Spočítej je znovu.` },
    { value: k[j] * m, why: `Tolik patří k řádku „${ds.polozky[j]}“, ne k řádku „${ds.polozky[i]}“.` },
  ], [
    `Diagram „${ds.nazev}“ (■ = ${znamena}): ${prehled}. Z těch řádků potřebuješ jen „${ds.polozky[i]}“.`,
    `Diagram „${ds.nazev}“ (■ = ${znamena}): ${prehled}. V řádku „${ds.polozky[i]}“ spočítej čtverečky a pak nezapomeň, že jeden čtvereček neznamená jeden — proto počet čtverečků ještě vynásob ${nasob}, nebo přidávej po ${po} tolikrát, kolik je v řádku čtverečků.`,
  ], [`V řádku „${ds.polozky[i]}“ je ${"■".repeat(k[i])}.`, `${k[i]} · ${m} = ${klic}`]);
}

function nejvic(maximum: boolean): PracticeTask {
  const ds = nahodny();
  const v = hodnoty(ds.min, ds.max);
  const cil = maximum ? Math.max(...v) : Math.min(...v);
  const idx = v.indexOf(cil);
  const optionFeedback: Record<string, string> = {};
  ds.polozky.forEach((p, i) => {
    if (i !== idx) optionFeedback[p] = `„${p}“ má ${v[i]}, ale „${ds.polozky[idx]}“ má ${maximum ? "víc" : "méně"} (${cil}).`;
  });
  return {
    question: `${tabulka(ds, v)}\n${maximum ? ds.nejvic : ds.nejmin}`,
    correctAnswer: ds.polozky[idx],
    options: shuffle(ds.polozky),
    optionFeedback,
    hints: [
      `Porovnej čísla ${v.join(", ")} z tabulky „${ds.nazev}“. Které z nich je ${maximum ? "největší" : "nejmenší"}?`,
      `Projdi tabulku „${ds.nazev}“ řádek po řádku shora dolů a průběžně si pamatuj ${maximum ? "největší" : "nejmenší"} číslo, které jsi zatím viděl. ${maximum ? "Největší číslo by v diagramu mělo nejvyšší sloupec" : "Nejmenší číslo by v diagramu mělo nejnižší sloupec"}. Až ho najdeš, přečti si, u kterého řádku stojí.`,
    ],
    solutionSteps: [`${maximum ? "Největší" : "Nejmenší"} číslo je ${cil}.`, `Patří k řádku „${ds.polozky[idx]}“.`],
  };
}

function rozdilMaxMin(): PracticeTask {
  let ds: Dataset, v: number[], d: number;
  do {
    ds = nahodny();
    v = hodnoty(ds.min, ds.max);
    d = Math.max(...v) - Math.min(...v);
  } while (v.includes(d));
  const max = Math.max(...v), min = Math.min(...v);
  const druhy = [...v].sort((a, b) => a - b)[1];
  return ciselnaUloha(`${tabulka(ds, v)}\nO kolik se liší největší a nejmenší číslo v tabulce?`, d, [
    { value: max + min, why: "Čísla se sečetla. Rozdíl zjistíš odečtením." },
    { value: max - druhy, why: `Odečetlo se ${druhy}, ale nejmenší číslo je ${min}.` },
    { value: max, why: `${max} je největší číslo. Ještě od něj odečti nejmenší.` },
  ], [
    `Které z čísel ${v.join(", ")} v tabulce „${ds.nazev}“ je největší a které nejmenší?`,
    `V tabulce „${ds.nazev}“ si nejdřív označ největší a nejmenší číslo — ta dvě se porovnávají, ostatní dvě teď nepotřebuješ. Rozdíl pak zjistíš odečtením: od většího z nich odečti menší. Kontrola: nejmenší číslo plus rozdíl musí dát zpátky největší.`,
  ], [`Největší: ${max}, nejmenší: ${min}`, `${max} − ${min} = ${d}`]);
}

function rozdilDiagram(): PracticeTask {
  const ds = nahodny();
  const m: 2 | 5 = Math.random() < 0.5 ? 2 : 5;
  const k = hodnoty(1, 8);
  let i = rnd(0, 3), j = rnd(0, 3);
  while (j === i || k[j] >= k[i]) { i = rnd(0, 3); j = rnd(0, 3); }
  const d = (k[i] - k[j]) * m;
  const znamena = m === 2 ? ds.dva : ds.pet;
  const prehled = ds.polozky.map((p, x) => `„${p}“ ${"■".repeat(k[x])}`).join(", ");
  return ciselnaUloha(`${diagram(ds, k, m)}\n${ds.oKolik(ds.tvar[i], ds.tvar[j])}`, d, [
    { value: k[i] - k[j], why: `${k[i] - k[j]} je rozdíl čtverečků. Každý čtvereček ale znamená ${znamena}.` },
    { value: (k[i] + k[j]) * m, why: `Řádky „${ds.polozky[i]}“ a „${ds.polozky[j]}“ se sečetly. Otázka se ptá, o kolik má první řádek víc než druhý.` },
    { value: k[i] * m, why: `Tolik je celý řádek „${ds.polozky[i]}“. Ještě od něj odečti řádek „${ds.polozky[j]}“.` },
  ], [
    `Diagram „${ds.nazev}“ (■ = ${znamena}): ${prehled}. Porovnávají se řádky „${ds.polozky[i]}“ a „${ds.polozky[j]}“.`,
    `Diagram „${ds.nazev}“ (■ = ${znamena}): ${prehled}. Spočítej, o kolik čtverečků je řádek „${ds.polozky[i]}“ delší než řádek „${ds.polozky[j]}“. Každý čtvereček navíc ale znamená ${znamena}, takže počet čtverečků navíc ještě vynásob ${m === 2 ? "dvěma" : "pěti"}.`,
  ], [`Čtverečky navíc: ${k[i]} − ${k[j]} = ${k[i] - k[j]}`, `${k[i] - k[j]} · ${m} = ${d}`]);
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, (_, i) => {
    if (level === 1) return i % 2 ? soucet() : cteniDiagramu(2);
    if (level === 2) return i % 3 === 2 ? cteniDiagramu(5) : nejvic(i % 3 === 0);
    return i % 2 ? rozdilMaxMin() : rozdilDiagram();
  });
}

export const TABULKY_DIAGRAMY: TopicMetadata[] = [
  {
    id: "g4-mat-tabulky-diagramy-4",
    rvpNodeId: "g4-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-diagramy-sloupcovy-kruhovy",
    displayName: "Čtení tabulek a diagramů",
    title: "Tabulky a diagramy",
    studentTitle: "Tabulky a grafy",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky a poznáš různé grafy.",
    keywords: [
      "tabulka", "sloupcový diagram", "kruhový diagram",
      "čtení dat", "interpretace grafu", "největší hodnota", "celkový součet",
    ],
    goals: [
      "Přečíst a porovnat data z tabulky.",
      "Určit celkový součet, maximum a minimum.",
      "Porozumět, co zobrazuje sloupcový a kruhový diagram.",
    ],
    boundaries: [
      "Pouze textové/číselné reprezentace dat (bez skutečných obrázků grafů).",
      "Nezahrnuje tvorbu grafu ani výpočet procent pro kruhový diagram.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4"],
    generator: gen,
    helpTemplate: {
      hint: "Tabulka přehledně ukazuje data. Pro každou otázku najdi správný řádek/sloupec a přečti hodnotu.",
      steps: [
        "Přečti záhlaví tabulky (co je v řádcích, co ve sloupcích).",
        "Pro celkový součet: sečti všechna čísla.",
        "Pro maximum: najdi největší číslo.",
        "Pro minimum: najdi nejmenší číslo.",
      ],
      commonMistake: "Záměna řádků a sloupců — vždy nejdříve zkontroluj záhlaví.",
      example: "Tabulka: Jablka=8, Banány=5, Pomeranče=7. Celkem = 20. Maximum = Jablka (8).",
    },
  },
];
