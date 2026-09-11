import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fmt, rnd, RADY } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Distraktory byly jen výsledek
// ± 1, 10, 100 a nápovědy stejné pro všechny úlohy. Teď distraktory
// vznikají z typických chyb (zapomenutý přenos, odčítání „menší od
// většího“, půjčka bez odečtení v dalším řádu), nápověda míří na konkrétní
// sloupec a postup končí zkouškou.
//
// L1: čtyřciferná čísla · L2: pěticiferná · L3: šesticiferná (do milionu).

const cifra = (n: number, c: number) => Math.floor(n / 10 ** c) % 10;
const delka = (a: number, b: number) => Math.max(String(a).length, String(b).length);

function scitaniKroky(a: number, b: number): { steps: string[]; prvniPrenos: number } {
  const steps: string[] = [];
  let carry = 0, prvniPrenos = -1;
  for (let c = 0; c < delka(a, b); c++) {
    const s = cifra(a, c) + cifra(b, c) + carry;
    steps.push(`${RADY[c]}: ${cifra(a, c)} + ${cifra(b, c)}${carry ? " + 1 (přenos)" : ""} = ${s}${s >= 10 ? ` → zapíšu ${s % 10}, přenáším 1` : ""}`);
    if (s >= 10 && prvniPrenos < 0) prvniPrenos = c;
    carry = s >= 10 ? 1 : 0;
  }
  if (carry) steps.push("Poslední přenos zapíšeme na začátek výsledku: 1");
  return { steps, prvniPrenos };
}

function odcitaniKroky(a: number, b: number): { steps: string[]; prvniPujcka: number } {
  const steps: string[] = [];
  let borrow = 0, prvniPujcka = -1;
  for (let c = 0; c < delka(a, b); c++) {
    const top = cifra(a, c) - borrow;
    const dB = cifra(b, c);
    const pred = borrow ? `${cifra(a, c)} − 1 (půjčka) = ${top}` : `${top}`;
    if (top < dB) {
      steps.push(`${RADY[c]}: ${pred}, to je méně než ${dB} → půjčíme si 1 z vyššího řádu: ${top + 10} − ${dB} = ${top + 10 - dB}`);
      if (prvniPujcka < 0) prvniPujcka = c;
      borrow = 1;
    } else {
      steps.push(`${RADY[c]}: ${pred} − ${dB} = ${top - dB}`);
      borrow = 0;
    }
  }
  return { steps, prvniPujcka };
}

function scitani(a: number, b: number): PracticeTask {
  const correct = a + b;
  let bez = 0;
  for (let c = 0; c < delka(a, b); c++) bez += ((cifra(a, c) + cifra(b, c)) % 10) * 10 ** c;
  const { steps, prvniPrenos } = scitaniKroky(a, b);
  return ciselnaUloha(`${fmt(a)} + ${fmt(b)} = ?`, correct, [
    { value: bez, why: "Tady se zapomnělo na přenosy: když je součet ve sloupci 10 nebo víc, zapíše se jen jednotka a 1 se přičte k dalšímu sloupci." },
    ...(prvniPrenos >= 0 ? [{ value: correct - 10 ** (prvniPrenos + 1), why: `Ve sloupci ${RADY[prvniPrenos]} vyšlo víc než 9, ale přenos 1 se nepřičetl k dalšímu sloupci.` }] : []),
    { value: correct + 10, why: "Výsledek je o 10 větší — v desítkách je přenos navíc nebo chyba v součtu." },
    { value: correct - 100, why: "Výsledek je o 100 menší — ve stovkách chybí přenos nebo je chyba v součtu." },
  ], [
    `Zapiš ${fmt(a)} a ${fmt(b)} pod sebe, jednotky pod jednotky. Začni sloupcem jednotek: ${cifra(a, 0)} + ${cifra(b, 0)}.`,
    `Sčítej sloupce zprava. Když součet ve sloupci přesáhne 9, zapiš jen jednotky a 1 přenes do dalšího sloupce${prvniPrenos >= 0 ? ` — poprvé se to stane u sloupce ${RADY[prvniPrenos]}` : ""}.`,
  ], [
    `Zapíšeme pod sebe ${fmt(a)} + ${fmt(b)} a sčítáme zprava:`,
    ...steps,
    `Výsledek: ${fmt(correct)}`,
    `Zkouška: ${fmt(correct)} − ${fmt(b)} = ${fmt(a)}`,
  ]);
}

function odcitani(a: number, b: number): PracticeTask {
  const correct = a - b;
  let mensiOdVetsiho = 0;
  for (let c = 0; c < delka(a, b); c++) mensiOdVetsiho += Math.abs(cifra(a, c) - cifra(b, c)) * 10 ** c;
  const { steps, prvniPujcka } = odcitaniKroky(a, b);
  return ciselnaUloha(`${fmt(a)} − ${fmt(b)} = ?`, correct, [
    { value: mensiOdVetsiho, why: "V některém sloupci se odečetla menší číslice od větší. Když je nahoře menší číslice, musíš si půjčit 1 z vyššího řádu." },
    ...(prvniPujcka >= 0 ? [{ value: correct + 10 ** (prvniPujcka + 1), why: `Ve sloupci ${RADY[prvniPujcka]} se půjčila desítka, ale ve vyšším řádu se pak neodečetla jednička.` }] : []),
    { value: correct - 10, why: "Výsledek je o 10 menší — v desítkách je půjčka navíc nebo chyba v odčítání." },
    { value: correct + 100, why: "Výsledek je o 100 větší — ve stovkách se zapomněla odečíst půjčka." },
  ], [
    `Zapiš menšenec ${fmt(a)} nad menšitel ${fmt(b)}. Začni jednotkami: ${cifra(a, 0)} − ${cifra(b, 0)} — stačí horní číslice?`,
    `Odčítej sloupce zprava. Když je nahoře menší číslice, půjč si 1 z vyššího řádu (nahoře přičti 10) a ve vyšším řádu pak odečti o 1 víc${prvniPujcka >= 0 ? ` — poprvé u sloupce ${RADY[prvniPujcka]}` : ""}.`,
  ], [
    `Zapíšeme pod sebe ${fmt(a)} − ${fmt(b)} a odčítáme zprava:`,
    ...steps,
    `Výsledek: ${fmt(correct)}`,
    `Zkouška: ${fmt(correct)} + ${fmt(b)} = ${fmt(a)}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  const [minA, maxA, minB, maxB] = level === 1 ? [1000, 9999, 1000, 8999]
    : level === 2 ? [10000, 99999, 10000, 89999] : [100000, 999999, 100000, 899999];
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 40; i++) {
    let a = rnd(minA, maxA), b = rnd(minB, maxB);
    if (Math.random() < 0.55) {
      // Součet zůstává v oboru úrovně (L1 do 9 999, L2 do 99 999, L3 do 999 999).
      while (a + b > maxA) { a = rnd(minA, maxA); b = rnd(minB, maxB); }
      tasks.push(scitani(a, b));
    } else {
      // Rozdíl aspoň desetina nejmenšího menšence — u „4 522 − 4 520“ by malá nápověda (2 − 0) prozradila výsledek.
      while (Math.abs(a - b) < minA / 10) { a = rnd(minA, maxA); b = rnd(minB, maxB); }
      if (b > a) [a, b] = [b, a];
      tasks.push(odcitani(a, b));
    }
  }
  return tasks;
}

export const PISEMNE_SCITANI_ODCITANI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-scitani-odcitani-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-scitani-a-odcitani-vicecifernych-cisel",
    displayName: "Písemné sčítání a odčítání",
    title: "Písemné sčítání a odčítání",
    studentTitle: "Sčítání pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se sčítat a odčítat velká čísla pod sebou.",
    keywords: [
      "sčítání", "odčítání", "písemné sčítání", "písemné odčítání",
      "víceciferná čísla", "přenos", "výpůjčka", "sloupec",
    ],
    goals: [
      "Zarovnat víceciferná čísla podle řádů a provést písemný součet.",
      "Provést písemný rozdíl s výpůjčkou z vyššího řádu.",
      "Zkontrolovat výsledek zpětným odčítáním / sčítáním.",
    ],
    boundaries: [
      "Nezahrnuje násobení ani dělení.",
      "Nezahrnuje desetinná čísla.",
      "Rozsah: čísla do 999 999 (level 3).",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-pisemne-nasobeni-4", "g4-mat-cisla-do-milionu-4"],
    generator: gen,
    helpTemplate: {
      hint: "Zapiš čísla pod sebe (jednotky pod jednotky, desítky pod desítky) a počítej sloupec po sloupci zprava.",
      steps: [
        "Zapiš čísla pod sebe — zarovnej řády.",
        "Začni od sloupce jednotek (nejpravější).",
        "Sčítáš-li: pokud součet ≥ 10, zapiš jednotky a přenes 1 do dalšího sloupce.",
        "Odčítáš-li: pokud nestačí, půjč si 1 z vyššího řádu (zvýší o 10, sousedu ubere 1).",
        "Postup opakuj pro desítky, stovky, tisíce…",
      ],
      commonMistake: "Děti zapomínají zarovnat řády (např. tisíce pod stovky) nebo zahodí přenos do dalšího sloupce.",
      example: "2 847 + 1 365:\n  2 847\n+ 1 365\n------\n  4 212  (7+5=12 → píšeme 2, neseme 1; 4+6+1=11 → píšeme 1, neseme 1; …)",
    },
  },
];
