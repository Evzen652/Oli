import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): 7/7/7 úloh s jednou nápovědou
// a bez zpětné vazby. Teď parametrický generátor nad pevnými bankami řad:
// L1 rostoucí řady s krokem 2, 5, 10 od násobku kroku (mezera uprostřed nebo
// na konci) · L2 klesající řady, krok 3 a řady od „nekulatého“ čísla ·
// L3 obrácený směr (mezera na začátku) a dva kroky dopředu (dvě mezery).
// Nápovědy, vysvětlení i zpětná vazba nesou čísla konkrétní řady.

const MEZERA = "___";
const DELKA = 5;

/** Záměnný krok — typická chyba „počítám po jiném čísle“. */
const JINY_KROK: Record<number, number> = { 2: 3, 3: 2, 5: 10, 10: 5 };

/**
 * Náhradní záměnné kroky pro případ, že by se distraktor trefil do čísla, které
 * v zadání viditelně stojí. U kroku 5 je totiž „chybný krok 10“ právě další člen
 * řady — dítě ho vyloučí na první pohled a z úlohy zbydou jen dvě smysluplné
 * možnosti. Bere se první krok, který na viditelné číslo nepadne.
 */
const JINE_KROKY: Record<number, number[]> = { 2: [3, 5], 3: [2, 5], 5: [10, 2], 10: [5, 2] };

function rada(start: number, krok: number): number[] {
  return Array.from({ length: DELKA }, (_, i) => start + i * krok);
}

/** První tři různé kandidáty v oboru 0–100, které nejsou klíčem. */
function tri(key: number, cands: Array<[number, string]>): [Distractor, Distractor, Distractor] {
  const seen = new Set([key]);
  const out: Distractor[] = [];
  for (const [v, why] of cands) {
    if (v < 0 || v > 100 || seen.has(v)) continue;
    seen.add(v);
    out.push({ value: String(v), why });
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Málo distraktorů pro klíč ${key}`);
  return out as [Distractor, Distractor, Distractor];
}

const smer = (krok: number) => (krok > 0 ? "roste" : "klesá");

/** L1/L2: jedna mezera uprostřed nebo na konci (před ní vždy stojí číslo). */
function mezeraUvnitr(start: number, krok: number, idx: number): PracticeTask {
  if (idx < 1) throw new Error("mezeraUvnitr: mezera musí mít souseda vlevo");
  const r = rada(start, krok);
  const x = r[idx];
  const prev = r[idx - 1];
  const k = Math.abs(krok);
  const vRade = new Set(r.filter((_, i) => i !== idx));
  const jinyK = JINE_KROKY[k].find((j) => !vRade.has(prev + j * Math.sign(krok))) ?? JINY_KROK[k];
  const jiny = jinyK * Math.sign(krok);
  // dvojice sousedních čísel, která v zadání opravdu stojí
  const p = idx >= 3 ? 0 : idx + 1;
  const [a, b] = [r[p], r[p + 1]];
  const zobraz = r.map((v, i) => (i === idx ? MEZERA : String(v))).join(", ");
  const d = tri(x, [
    [prev + jiny, `${krok > 0 ? "Přičetl" : "Odečetl"} jsi ${Math.abs(jiny)}. Krok této řady je ale ${k}: ${a} → ${b}.`],
    [prev - krok, `Tady jsi šel opačným směrem. Řada ${smer(krok)}, podívej se na ${a} → ${b}.`],
    [x + 1, `Jen o 1 vedle. Od ${prev} jdi přesně o ${k}.`],
    [x - 1, `Jen o 1 vedle. Od ${prev} jdi přesně o ${k}.`],
  ]);
  const dalsi = idx < DELKA - 1 ? ` Sedí to i s dalším číslem ${r[idx + 1]}.` : "";
  return choice(`Doplň chybějící číslo: ${zobraz}`, String(x), d, {
    hints: [
      `Porovnej ${a} a ${b}: o kolik se čísla mění?`,
      `Každé další číslo je o stejný krok ${krok > 0 ? "větší" : "menší"}. Zjisti krok z čísel ${a} a ${b} a pak ho ${krok > 0 ? "přičti k číslu" : "odečti od čísla"} ${prev}, které stojí před mezerou.`,
    ],
    explanation: `Krok řady je ${krok > 0 ? "+" : "−"}${k} (${a} → ${b}). Proto ${prev} ${krok > 0 ? "+" : "−"} ${k} = ${x}.${dalsi}`,
  });
}

/** L3: mezera na začátku — jdi od prvního známého čísla zpátky. */
function mezeraNaZacatku(start: number, krok: number): PracticeTask {
  const r = rada(start, krok);
  const x = r[0];
  const f = r[1];
  const k = Math.abs(krok);
  const jiny = JINY_KROK[k] * Math.sign(krok);
  const zobraz = [MEZERA, ...r.slice(1)].join(", ");
  const d = tri(x, [
    [f + krok, `Šel jsi dopředu, ne zpátky. Číslo ${f + krok} už v řadě stojí za ${f}.`],
    [f - jiny, `Použil jsi krok ${Math.abs(jiny)}. Krok této řady je ${k}: ${r[1]} → ${r[2]}.`],
    [x + 1, `Jen o 1 vedle. Od ${f} jdi zpátky přesně o ${k}.`],
    [x - 1, `Jen o 1 vedle. Od ${f} jdi zpátky přesně o ${k}.`],
  ]);
  return choice(`Které číslo patří na začátek řady? ${zobraz}`, String(x), d, {
    hints: [
      `Řada pokračuje ${r[1]}, ${r[2]}, ${r[3]}: jaký má krok a kterým směrem jde?`,
      krok > 0
        ? `Mezera je na začátku, před číslem ${f}. Řada roste, takže směrem zpátky se čísla zmenšují — krok od čísla ${f} odečti.`
        : `Mezera je na začátku, před číslem ${f}. Řada klesá, takže směrem zpátky se čísla zvětšují — krok k číslu ${f} přičti.`,
    ],
    explanation: `Krok řady je ${krok > 0 ? "+" : "−"}${k}. Před číslem ${f} proto stojí ${f} ${krok > 0 ? "−" : "+"} ${k} = ${x}. Zkouška: ${x} ${krok > 0 ? "+" : "−"} ${k} = ${f}.`,
  });
}

/** L3: dvě mezery na konci — ptáme se na tu poslední (dva kroky). */
function dveMezery(start: number, krok: number): PracticeTask {
  const r = rada(start, krok);
  const L = r[2];
  const y = r[3];
  const x = r[4];
  const k = Math.abs(krok);
  const jiny = JINY_KROK[k] * Math.sign(krok);
  const zobraz = [...r.slice(0, 3), MEZERA, MEZERA].join(", ");
  const d = tri(x, [
    [y, `${y} patří do první mezery. Ptáme se na poslední mezeru — o krok dál.`],
    [x + krok, `To je o krok dál, než je poslední mezera. Od ${L} jdi jen dvakrát.`],
    [L + 2 * jiny, `Dvakrát jsi použil krok ${Math.abs(jiny)}. Krok této řady je ${k}: ${r[0]} → ${r[1]}.`],
    [x + 1, `Jen o 1 vedle. Od ${L} jdi dvakrát přesně o ${k}.`],
  ]);
  return choice(`Které číslo patří do poslední mezery? ${zobraz}`, String(x), d, {
    hints: [
      `Zjisti krok z čísel ${r[0]} a ${r[1]}, pak ho použij dvakrát.`,
      `Do první mezery patří číslo o jeden krok za ${L}. Poslední mezera je o další krok dál — od čísla ${L} tedy musíš krok ${krok > 0 ? "přičíst" : "odečíst"} dvakrát za sebou.`,
    ],
    explanation: `Krok řady je ${krok > 0 ? "+" : "−"}${k}. První mezera: ${L} ${krok > 0 ? "+" : "−"} ${k} = ${y}. Poslední mezera: ${y} ${krok > 0 ? "+" : "−"} ${k} = ${x}.`,
  });
}

// ── Banky úrovní: [start, krok, index mezery] ─────────────────────────────

const L1: [number, number, number][] = [
  [10, 10, 2], [0, 10, 3], [30, 10, 2], [20, 10, 4], [50, 10, 1],
  [5, 5, 2], [15, 5, 2], [35, 5, 3], [55, 5, 4], [70, 5, 1],
  [2, 2, 2], [10, 2, 3], [16, 2, 4], [40, 2, 2],
];

const L2: [number, number, number][] = [
  [90, -10, 2], [75, -10, 3], [100, -10, 4],
  [50, -5, 2], [85, -5, 1], [40, -5, 4],
  [20, -2, 2], [36, -2, 3], [51, -2, 4],
  [3, 3, 3], [12, 3, 2], [24, 3, 4],
  [13, 10, 2], [47, 10, 3], [7, 5, 2], [26, 5, 4],
];

const L3_ZACATEK: [number, number][] = [
  [23, 3], [64, -3], [38, 5], [91, -5], [17, 10], [44, -2], [76, -10],
];
const L3_DVE: [number, number][] = [
  [8, 3], [95, -5], [46, -3], [27, 5], [62, -10], [81, -2], [33, 10],
];

function gen(level: number): PracticeTask[] {
  const tasks = level === 1
    ? L1.map(([s, k, i]) => mezeraUvnitr(s, k, i))
    : level === 2
      ? L2.map(([s, k, i]) => mezeraUvnitr(s, k, i))
      : [...L3_ZACATEK.map(([s, k]) => mezeraNaZacatku(s, k)), ...L3_DVE.map(([s, k]) => dveMezery(s, k))];
  return shuffle(tasks);
}

export const POSLOUPNOSTICISEL: TopicMetadata[] = [
  {
    id: "g2-mat-posloupnosti",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-posloupnosti-cisel",
    title: "Posloupnosti čísel",
    studentTitle: "Co přijde dál?",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Najdeš chybějící číslo v řadě čísel.",
    keywords: ["posloupnost", "řada", "chybějící číslo", "vzor", "krok"],
    goals: [
      "Rozpoznat pravidlo číselné řady.",
      "Doplnit chybějící číslo do posloupnosti.",
      "Pracovat s kroky ±2, ±3, ±5 a ±10.",
    ],
    boundaries: ["Čísla 0–100.", "Kroky ±2, ±3, ±5, ±10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Najdi krok — o kolik se každé číslo mění.",
      steps: [
        "Odečti sousední čísla: 15 − 10 = 5 → krok je +5.",
        "Přidej krok k číslu před mezerou.",
        "Zkontroluj číslem za mezerou.",
      ],
      commonMistake: "Záměna rostoucí a klesající řady — dávej pozor na směr.",
      example: "5, 10, 15, ___, 25 → krok +5 → chybí 20.",
    },
  },
];
