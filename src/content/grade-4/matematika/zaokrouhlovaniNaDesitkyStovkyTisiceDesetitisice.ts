import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fmt, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Distraktory byly jen ± jeden řád
// bez vysvětlení, možnosti mohly klesnout na tři, nápověda měla překlep
// („nul zbytek“) a L3 se od L2 lišila jen velikostí čísla. Teď:
// L1 desítky a stovky (do 9 999) · L2 tisíce a stovky (do 99 999)
// L3 desetitisíce a tisíce (do 999 999) a obrácená úloha: které číslo se
// zaokrouhlí na dané číslo. Distraktory: opačný směr, zaokrouhlení na jiný
// řád, sousední násobek.

type Rad = 10 | 100 | 1000 | 10000;
const NA: Record<Rad, string> = { 10: "desítky", 100: "stovky", 1000: "tisíce", 10000: "desetitisíce" };
const POD: Record<Rad, string> = { 10: "jednotek", 100: "desítek", 1000: "stovek", 10000: "tisíců" };

const zaokr = (n: number, r: number) => Math.round(n / r) * r;
const cifra = (n: number, r: Rad) => Math.floor(n / (r / 10)) % 10;

function zaokrouhli(r: Rad, min: number, max: number): PracticeTask {
  let n = rnd(min, max);
  while (n % r === 0) n = rnd(min, max);
  const klic = zaokr(n, r);
  const d = cifra(n, r);
  const dolu = Math.floor(n / r) * r;
  const chyby = [
    d >= 5
      ? { value: fmt(dolu), why: `Tohle je zaokrouhlení dolů. Na místě ${POD[r]} je ${d}, a to je 5 nebo víc — zaokrouhluje se nahoru.` }
      : { value: fmt(dolu + r), why: `Tohle je zaokrouhlení nahoru. Na místě ${POD[r]} je ${d}, a to je méně než 5 — zaokrouhluje se dolů.` },
    ...(r < 10000 ? [{ value: fmt(zaokr(n, r * 10)), why: `Tohle je zaokrouhlení na ${NA[(r * 10) as Rad]}, ne na ${NA[r]}.` }] : []),
    ...(r > 10 ? [{ value: fmt(zaokr(n, r / 10)), why: `Tohle je zaokrouhlení na ${NA[(r / 10) as Rad]}, ne na ${NA[r]}.` }] : []),
    { value: fmt(klic + r), why: `Zaokrouhlené číslo má být co nejblíž číslu ${fmt(n)}. ${fmt(klic + r)} je od něj dál než ${fmt(klic)}.` },
    { value: fmt(klic - r), why: `Zaokrouhlené číslo má být co nejblíž číslu ${fmt(n)}. ${fmt(klic - r)} je od něj dál než ${fmt(klic)}.` },
  ];
  return ciselnaUloha(`Zaokrouhli číslo ${fmt(n)} na ${NA[r]}.`, fmt(klic), chyby, [
    `Při zaokrouhlování na ${NA[r]} rozhoduje číslice na místě ${POD[r]}. Která to je v čísle ${fmt(n)}?`,
    `Najdi v čísle ${fmt(n)} místo ${POD[r]}. Je-li tam 0 až 4, zaokrouhli dolů, je-li tam 5 až 9, zaokrouhli nahoru. Všechny číslice vpravo od řádu, na který zaokrouhluješ, nahraď nulami.`,
  ], [
    `Zaokrouhlujeme na ${NA[r]}, rozhoduje číslice na místě ${POD[r]}: ${d}.`,
    d >= 5 ? `${d} ≥ 5, zaokrouhlujeme nahoru: ${fmt(n)} ≐ ${fmt(klic)}.` : `${d} < 5, zaokrouhlujeme dolů: ${fmt(n)} ≐ ${fmt(klic)}.`,
  ]);
}

/** Obrácená úloha: které z čísel se zaokrouhlí na T? */
function ktereCislo(r: 10 | 100 | 1000): PracticeTask {
  const T = rnd(r === 1000 ? 12 : 21, 99) * r;
  const pul = r / 2;
  let klic: number;
  do klic = rnd(T - pul + 1, T + pul - 2); while (klic === T);
  const vedle = (x: number) => ({
    value: fmt(x),
    why: `${fmt(x)} má na místě ${POD[r]} číslici ${cifra(x, r)}, proto se zaokrouhlí na ${fmt(zaokr(x, r))}, ne na ${fmt(T)}.`,
  });
  const smer = Math.random() < 0.5 ? -1 : 1;
  const chyby = [
    vedle(T - pul - 1 - rnd(0, Math.floor(pul / 2) - 1)),
    vedle(T + pul + rnd(0, Math.floor(pul / 2) - 1)),
    vedle(T + smer * r * rnd(1, 2) + rnd(-pul + 1, pul - 2)),
  ];
  return ciselnaUloha(`Které číslo se po zaokrouhlení na ${NA[r]} změní na ${fmt(T)}?`, fmt(klic), chyby, [
    `Zaokrouhli v duchu na ${NA[r]} každou možnost, třeba ${chyby[2].value}. U které vyjde ${fmt(T)}?`,
    `Na ${fmt(T)} se zaokrouhlí čísla od ${fmt(T - pul)} do ${fmt(T + pul - 1)}. Hledej možnost z tohoto rozmezí — pozor na čísla těsně pod ${fmt(T - pul)} a od ${fmt(T + pul)} výš.`,
  ], [
    `Na ${fmt(T)} se zaokrouhlí čísla od ${fmt(T - pul)} do ${fmt(T + pul - 1)}.`,
    `Do tohoto rozmezí patří ${fmt(klic)}: na místě ${POD[r]} má ${cifra(klic, r)}, zaokrouhlí se na ${fmt(T)}.`,
  ]);
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, (_, i) => {
    if (level === 1) return i % 2 ? zaokrouhli(10, 100, 9999) : zaokrouhli(100, 1000, 9999);
    if (level === 2) return i % 2 ? zaokrouhli(1000, 10000, 99999) : zaokrouhli(100, 10000, 99999);
    if (i % 3 === 0) return zaokrouhli(10000, 100000, 999999);
    if (i % 3 === 1) return zaokrouhli(1000, 100000, 999999);
    return ktereCislo(([10, 100, 1000] as const)[rnd(0, 2)]);
  });
}

export const ZAOKROUHLOVANI: TopicMetadata[] = [
  {
    id: "g4-mat-zaokrouhlovani-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1-000-000-zaokrouhlovani-na-desitky-stovky-tisice-desetitisice",
    displayName: "Zaokrouhlování",
    title: "Zaokrouhlování čísel",
    studentTitle: "Zaokrouhlování",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1 000 000",
    briefDescription: "Naučíš se zaokrouhlovat čísla nahoru i dolů.",
    keywords: [
      "zaokrouhlování", "zaokrouhlit na desítky", "zaokrouhlit na stovky",
      "zaokrouhlit na tisíce", "odhad", "přibližná hodnota",
    ],
    goals: [
      "Zaokrouhlit číslo na desítky, stovky, tisíce nebo desetitisíce.",
      "Vysvětlit pravidlo zaokrouhlování (číslice ≥ 5 / < 5).",
      "Využít zaokrouhlování pro odhad výsledku výpočtu.",
    ],
    boundaries: [
      "Pouze přirozená čísla do 999 999.",
      "Nezahrnuje zaokrouhlování desetinných čísel.",
      "Nezahrnuje zaokrouhlování na setiny nebo jiné malé řády.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-pisemne-scitani-odcitani-4", "g4-mat-cisla-do-milionu-4"],
    generator: gen,
    helpTemplate: {
      hint: "Podívej se na číslici řádu těsně pod tím, na který zaokrouhlujeme. Je-li ≥ 5, přičti 1 k vyšší číslici; je-li < 5, nech ji. Všechny nižší číslice nahraď nulami.",
      steps: [
        "Urči, na jaký řád zaokrouhlujeme (desítky, stovky…).",
        "Podívej se na číslici o jeden řád níže.",
        "Je-li tato číslice ≥ 5 → zaokrouhlujeme nahoru (přičteme 1 k danému řádu).",
        "Je-li tato číslice < 5 → zaokrouhlujeme dolů (nechme řád beze změny).",
        "Všechny číslice nižšího řádu nahradíme nulami.",
      ],
      commonMistake: "Zaokrouhlení čísla 4 500 na tisíce: děti napíší 4 000 místo 5 000 (číslice stovek je 5 → nahoru).",
      example: "3 762 zaokrouhlíme na stovky: číslice desítek = 6 ≥ 5 → 3 800.",
    },
  },
];
