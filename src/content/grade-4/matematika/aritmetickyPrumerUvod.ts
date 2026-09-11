import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Nápovědy byly u všech úloh stejné
// („Sečti všechna čísla.“), distraktory jen ±1 a ±2 bez vysvětlení a klíč se
// mohl objevit přímo mezi zadanými čísly. Teď jsou distraktory typické chyby
// (zapomenuté dělení, dělení špatným počtem, prostřední číslo místo průměru)
// a klíč nikdy není mezi zadanými čísly.
// L1 tři čísla do 20 · L2 čtyři až pět čísel do 50 · L3 chybějící číslo z průměru.

const POCET_1P: Record<number, string> = { 3: "tři", 4: "čtyři", 5: "pět" };
const POCET_7P: Record<number, string> = { 2: "dvěma", 3: "třemi", 4: "čtyřmi", 5: "pěti" };

const KONTEXT = [
  (s: string) => `Jaký je průměr čísel ${s}?`,
  (s: string) => `Ema měla v testech tyto počty bodů: ${s}. Kolik bodů měla průměrně?`,
  (s: string) => `Teploty v poledne byly ${s} °C. Jaká byla průměrná teplota ve °C?`,
  (s: string) => `Družstvo sklidilo za jednotlivé dny ${s} kg jablek. Kolik kilogramů to bylo průměrně za den?`,
];

const seznam = (xs: number[]) => `${xs.slice(0, -1).join(", ")} a ${xs[xs.length - 1]}`;

function prumer(count: number, max: number): PracticeTask {
  let nums: number[], sum: number, avg: number;
  do {
    nums = Array.from({ length: count }, () => rnd(1, max));
    sum = nums.reduce((a, b) => a + b, 0);
    avg = sum / count;
  } while (!Number.isInteger(avg) || nums.includes(avg) || avg === count || new Set(nums).size < count);
  const serazena = [...nums].sort((a, b) => a - b);
  const chyby = [
    { value: sum, why: `${sum} je součet. Průměr dostaneš, když součet vydělíš počtem čísel.` },
    ...(sum % (count - 1) === 0 ? [{ value: sum / (count - 1), why: `Součet se dělil ${POCET_7P[count - 1]}. Čísel je ale ${POCET_1P[count]}.` }] : []),
    ...(count % 2 === 1 ? [{ value: serazena[Math.floor(count / 2)], why: "To je prostřední číslo, když čísla seřadíš. Průměr se ale počítá ze součtu všech čísel." }] : []),
    { value: avg + 1, why: `Zkouška: ${count} × ${avg + 1} = ${count * (avg + 1)}, ale součet je ${sum}.` },
    { value: avg - 1, why: `Zkouška: ${count} × ${avg - 1} = ${count * (avg - 1)}, ale součet je ${sum}.` },
  ];
  // Kontext podle součtu: stejná čísla = stejná úloha (jinak by se malá nápověda opakovala u různých zadání).
  return ciselnaUloha(KONTEXT[sum % KONTEXT.length](seznam(nums)), avg, chyby, [
    `Nejdřív sečti všechna čísla: ${nums.join(" + ")}. Kolik vyjde?`,
    `Průměr = součet všech čísel ÷ jejich počet. Čísel je ${POCET_1P[count]}, takže celý součet vyděl ${POCET_7P[count]}.`,
  ], [
    `Součet: ${nums.join(" + ")} = ${sum}`,
    `Průměr: ${sum} ÷ ${count} = ${avg}`,
    `Průměr leží mezi nejmenším (${serazena[0]}) a největším (${serazena[count - 1]}) číslem.`,
  ]);
}

function chybejici(): PracticeTask {
  const count = rnd(3, 4);
  let avg = 0, known: number[] = [], sumKnown = 0, missing = 0;
  do {
    avg = rnd(6, 25);
    known = Array.from({ length: count - 1 }, () => rnd(1, 2 * avg));
    sumKnown = known.reduce((a, b) => a + b, 0);
    missing = avg * count - sumKnown;
  } while (missing < 2 || missing > 99 || missing === avg || missing === count
    || known.includes(missing) || known.includes(avg) || new Set(known).size < known.length);
  const celek = avg * count;
  const [kolika, kolik, porade] = count === 3 ? ["tří", "Dvě", "třetí"] : ["čtyř", "Tři", "čtvrté"];
  return ciselnaUloha(`Průměr ${kolika} čísel je ${avg}. ${kolik} z nich jsou ${seznam(known)}. Jaké je ${porade} číslo?`, missing, [
    { value: avg, why: `Hledané číslo nemusí být rovno průměru. Průměr ${avg} říká, že všechna čísla dohromady dají ${count} × ${avg} = ${celek}.` },
    { value: celek, why: `${celek} je součet všech čísel. Ještě od něj odečti známá čísla.` },
    { value: sumKnown, why: `${sumKnown} je součet známých čísel. Hledané číslo je to, co jim chybí do ${celek}.` },
    { value: missing + 1, why: `Zkouška: (${[...known, missing + 1].join(" + ")}) ÷ ${count} nedá ${avg}.` },
  ], [
    `Jaký je součet všech čísel, když je jejich průměr ${avg}? Známá čísla jsou ${seznam(known)}.`,
    `Součet všech čísel = průměr × počet čísel = ${avg} × ${count}. Od tohoto součtu odečti známá čísla ${seznam(known)} — co zbude, je hledané číslo.`,
  ], [
    `Součet všech ${kolika} čísel: ${avg} · ${count} = ${celek}`,
    `Známá čísla: ${known.join(" + ")} = ${sumKnown}`,
    `Hledané číslo: ${celek} − ${sumKnown} = ${missing}`,
    `Zkouška: (${[...known, missing].join(" + ")}) ÷ ${count} = ${avg} ✓`,
  ]);
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, () => (level === 1 ? prumer(3, 20) : level === 2 ? prumer(rnd(4, 5), 50) : chybejici()));
}

export const ARITMETICKY_PRUMER: TopicMetadata[] = [
  {
    id: "g4-mat-aritmeticky-prumer-4",
    rvpNodeId: "g4-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-uvod",
    displayName: "Průměr čísel",
    title: "Aritmetický průměr",
    studentTitle: "Průměr",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Sečteš čísla, vydělíš jejich počtem a máš průměr.",
    keywords: [
      "průměr", "aritmetický průměr", "součet", "počet hodnot",
      "statistika", "data", "průměrná hodnota",
    ],
    goals: [
      "Vypočítat aritmetický průměr skupiny čísel.",
      "Porozumět průměru jako spravedlivemu rozdeleni.",
      "Určit chybějící člen skupiny ze zadaného průměru.",
    ],
    boundaries: [
      "Pouze celé výsledky průměru (bez desetinných čísel).",
      "Počet hodnot: 3–5.",
      "Nezahrnuje vážený průměr ani medián.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Průměr = (součet všech čísel) ÷ (počet čísel). Lze si to představit jako: kdybychom vše rozdělili rovnoměrně, kolik dostane každý?",
      steps: [
        "Sečti všechna čísla.",
        "Vyděl jejich počtem.",
        "Výsledek je průměr.",
      ],
      commonMistake: "Vydělení jen počtem čísel > 1 (žáci zapomenou zahrnout všechna čísla do součtu).",
      example: "Průměr čísel 4, 8, 6: součet = 18, počet = 3 → průměr = 18 ÷ 3 = 6.",
    },
  },
];
