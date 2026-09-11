import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fdec, fmt, pick, rnd, sada, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami:
// čárka posunutá o špatný počet míst, posun na špatnou stranu, jen připsané
// nuly (3,45 × 100 = 3,4500).
// L1 násobení 10, 100, 1 000 · L2 dělení 10, 100, 1 000 (i s nulami na
// začátku: 4,5 ÷ 100 = 0,045) · L3 převody jednotek a obrácená úloha (čím se
// násobilo).

const MOCNINY = [10, 100, 1000];
const NULY = ["jednu nulu", "dvě nuly", "tři nuly"];
const MIST = ["o jedno místo", "o dvě místa", "o tři místa"];
/** Náhodné desetinné číslo s jedním až dvěma místy za čárkou (bez nuly na konci). */
function cislo(): number {
  const mist = rnd(1, 2), n = rnd(11, 999);
  if (n % 10 === 0) return cislo();
  return n / 10 ** mist;
}

function nasob(): PracticeTask | null {
  const x = cislo(), k = rnd(0, 2), m = MOCNINY[k];
  const key = x * m;
  const chyby: Chyba[] = [
    ...MOCNINY.filter((q) => q !== m).map((q) => ({ value: fdec(x * q), why: `Čárka se posunula ${MIST[MOCNINY.indexOf(q)]}, ale ${fmt(m)} má ${NULY[k]}.` })),
    { value: fdec(x / m), why: "Čárka se posunula doleva. Při násobení se číslo zvětší — čárka jde doprava." },
    { value: `${fdec(x)}${"0".repeat(k + 1)}`, why: "Nuly se jen připsaly za desetinná místa, číslo se tím nezměnilo. Čárka se musí posunout." },
  ];
  return ciselnaUloha(`Vypočítej: ${fdec(x)} × ${fmt(m)}`, fdec(key), chyby, [
    `Kolik nul má ${fmt(m)}? O tolik míst posuň desetinnou čárku v čísle ${fdec(x)}.`,
    "Při násobení deseti, stem nebo tisícem se čárka posouvá doprava — o tolik míst, kolik nul má násobitel. Chybějící místa doplníš nulami.",
  ], [
    `${fmt(m)} má ${NULY[k]} → čárka ${MIST[k]} doprava`,
    `${fdec(x)} × ${fmt(m)} = ${fdec(key)}`,
  ]);
}

function del(): PracticeTask | null {
  const x = Math.random() < 0.5 ? cislo() : rnd(2, 950), k = rnd(0, 2), m = MOCNINY[k];
  if (Number.isInteger(x) && x % 10 === 0) return null;
  const key = x / m;
  const chyby: Chyba[] = [
    ...MOCNINY.filter((q) => q !== m).map((q) => ({ value: fdec(x / q), why: `Čárka se posunula ${MIST[MOCNINY.indexOf(q)]}, ale ${fmt(m)} má ${NULY[k]}.` })),
    { value: fdec(x * m), why: "Čárka se posunula doprava. Při dělení se číslo zmenší — čárka jde doleva." },
    { value: fdec(x), why: "Číslo zůstalo stejné — čárka se neposunula." },
  ];
  return ciselnaUloha(`Vypočítej: ${fdec(x)} : ${fmt(m)}`, fdec(key), chyby, [
    `Kolik nul má ${fmt(m)}? O tolik míst posuň desetinnou čárku v čísle ${fdec(x)} doleva.`,
    "Při dělení deseti, stem nebo tisícem se čárka posouvá doleva. Když nejsou číslice, doplň vpředu nuly a před čárku napiš 0.",
  ], [
    `${fmt(m)} má ${NULY[k]} → čárka ${MIST[k]} doleva`,
    `${fdec(x)} : ${fmt(m)} = ${fdec(key)}`,
  ]);
}

// [větší jednotka, menší jednotka, kolik menších je ve větší, 2. pád množného čísla větší, 2. pád mn. č. menší]
const JEDNOTKY: [string, string, number, string, string][] = [
  ["m", "cm", 100, "metrů", "centimetrů"], ["km", "m", 1000, "kilometrů", "metrů"], ["cm", "mm", 10, "centimetrů", "milimetrů"],
  ["kg", "g", 1000, "kilogramů", "gramů"], ["l", "ml", 1000, "litrů", "mililitrů"], ["m", "mm", 1000, "metrů", "milimetrů"],
];

function prevod(): PracticeTask | null {
  const [velka, mala, f, velkaGen, malaGen] = pick(JEDNOTKY);
  const naMale = Math.random() < 0.5;
  const x = naMale ? cislo() : rnd(2, 99) * pick([1, 5, 10]) + pick([0, 5]);
  if (!naMale && x % 10 === 0) return null;
  const key = naMale ? x * f : x / f;
  const jine = MOCNINY.filter((q) => q !== f);
  return ciselnaUloha(`Kolik ${naMale ? malaGen : velkaGen} je ${fdec(x)} ${naMale ? velka : mala}?`, fdec(key), [
    ...jine.map((q) => ({ value: fdec(naMale ? x * q : x / q), why: `1 ${velka} = ${fmt(f)} ${mala}, ne ${fmt(q)} ${mala}.` })),
    { value: fdec(naMale ? x / f : x * f), why: naMale ? "Na menší jednotky vyjde číslo větší — čárka jde doprava." : "Na větší jednotky vyjde číslo menší — čárka jde doleva." },
  ], [
    `Kolik ${malaGen} má jeden ${velka === "l" ? "litr" : velka === "kg" ? "kilogram" : velka === "km" ? "kilometr" : velka === "cm" ? "centimetr" : "metr"}? Bude číslo v odpovědi víc, nebo míň než ${fdec(x)}?`,
    `1 ${velka} = ${fmt(f)} ${mala}. ${naMale ? "Na menší jednotku násob — čárka jde doprava." : "Na větší jednotku děl — čárka jde doleva."} Posouváš o tolik míst, kolik nul má ${fmt(f)}. Malých jednotek se do jedné velké vejde hodně — proto číslo v malých jednotkách vyjde vždycky vyšší.`,
  ], [
    `1 ${velka} = ${fmt(f)} ${mala}`,
    `${fdec(x)} ${naMale ? `× ${fmt(f)}` : `: ${fmt(f)}`} = ${fdec(key)}`,
  ]);
}

function obracene(): PracticeTask | null {
  const x = cislo(), k = rnd(0, 2), m = MOCNINY[k], nasobeni = Math.random() < 0.5;
  const y = nasobeni ? x * m : x / m;
  const key = `${nasobeni ? "×" : ":"} ${fmt(m)}`;
  return ciselnaUloha(`Čím se číslo ${fdec(x)} vynásobilo nebo vydělilo, když vyšlo ${fdec(y)}?`, key, [
    ...MOCNINY.filter((q) => q !== m).map((q) => ({ value: `${nasobeni ? "×" : ":"} ${fmt(q)}`, why: `Čárka se posunula ${MIST[k]}, to odpovídá číslu ${fmt(m)}.` })),
    { value: `${nasobeni ? ":" : "×"} ${fmt(m)}`, why: nasobeni ? "Číslo se zvětšilo, takže se násobilo." : "Číslo se zmenšilo, takže se dělilo." },
  ], [
    `Zvětšilo se číslo ${fdec(x)} na ${fdec(y)}, nebo zmenšilo? O kolik míst se posunula čárka?`,
    "Když se číslo zvětší, násobilo se; když se zmenší, dělilo se. Počet míst, o které se čárka posunula, je počet nul v čísle, kterým se násobilo nebo dělilo (deset, sto, nebo tisíc).",
  ], [
    `${fdec(x)} → ${fdec(y)}: čárka ${MIST[k]} ${nasobeni ? "doprava" : "doleva"}`,
    `To je ${key}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, nasob);
  if (level === 2) return sada(30, del);
  return sada(30, (i) => (i % 3 === 2 ? obracene() : prevod()));
}

export const NASOBENIADELENIDESETINNYCHCISEL101001000: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000",
    title: "Násobení a dělení desetinných čísel 10, 100, 1000",
    studentTitle: "×10, ×100, ×1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se násobit a dělit desetinná čísla desetkami a stovkami.",
    keywords: ["násobení desetinných čísel", "dělení desetinných čísel", "desetinná čárka", "10", "100", "1000"],
    goals: [
      "Násobit desetinné číslo deseti, stem nebo tisícem posunem desetinné čárky",
      "Dělit desetinné číslo deseti, stem nebo tisícem posunem desetinné čárky",
      "Vysvětlit pravidlo posunu desetinné čárky",
    ],
    boundaries: ["Bez obecného násobení dvou desetinných čísel", "Bez záporných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při násobení ×10 posuň desetinnou čárku o 1 místo doprava. Při násobení ×100 o 2 místa, ×1000 o 3 místa. Při dělení naopak — doleva.",
      steps: [
        "Zjisti, čím násobíš nebo děláš: ×10, ×100, nebo ×1000.",
        "Spočítej počet nul: ×10 = 1 nula, ×100 = 2 nuly, ×1000 = 3 nuly.",
        "Posuň desetinnou čárku o tolik míst doprava (násobení) nebo doleva (dělení).",
        "Pokud chybí číslice, doplň nuly.",
      ],
      commonMistake: "Chyba: 3,14 × 100 = 31,4. Správně: 3,14 × 100 = 314 (čárka se posune o 2 místa).",
      example: "2,5 × 100: posunu čárku o 2 místa doprava → 250. Nebo: 350 ÷ 10 = 35,0 = 35.",
    },
  },
];
