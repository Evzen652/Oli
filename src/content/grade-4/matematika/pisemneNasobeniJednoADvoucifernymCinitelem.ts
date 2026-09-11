import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fmt, rnd, RADY } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Distraktory byly jen výsledek
// ± činitel (žádná typická chyba), nápovědy stejné pro všechny úlohy
// a s chybou („Přenos (desetiny výsledku)“ — jde o desítky), postup u L1/L2
// jen „Násobíme číslici po číslici. Výsledek: …“. Teď distraktory vznikají
// z typických chyb (zapomenutý přenos, nezapsaný poslední přenos,
// neposunutý mezisoučet) a postup ukazuje každý sloupec.
//
// L1: trojciferné × jednociferné · L2: čtyřciferné × jednociferné
// L3: trojciferné × dvouciferné (bez násobků deseti).

function bezPrenosu(a: number, b: number): number {
  let res = 0, place = 1, x = a;
  while (x > 0) { res += ((x % 10) * b % 10) * place; place *= 10; x = Math.floor(x / 10); }
  return res;
}

function sloupce(a: number, b: number): string[] {
  const steps: string[] = [];
  const cifry = String(a).split("").reverse().map(Number);
  let carry = 0;
  cifry.forEach((d, i) => {
    const p = d * b + carry;
    const posledni = i === cifry.length - 1;
    const plus = carry ? ` + ${carry} (přenos)` : "";
    steps.push(posledni
      ? `${RADY[i]}: ${d} × ${b}${plus} = ${p} → zapíšu celé ${p}`
      : `${RADY[i]}: ${d} × ${b}${plus} = ${p} → zapíšu ${p % 10}${p >= 10 ? `, přenáším ${Math.floor(p / 10)}` : ""}`);
    carry = Math.floor(p / 10);
  });
  return steps;
}

function jednociferny(a: number, b: number): PracticeTask {
  const correct = a * b;
  const p0 = (a % 10) * b;
  const n = String(a).length;
  const odhadA = Math.round(a / 10 ** (n - 1)) * 10 ** (n - 1);
  return ciselnaUloha(`${fmt(a)} × ${b} = ?`, correct, [
    { value: bezPrenosu(a, b), why: "Tady se zapomnělo na přenosy: v každém sloupci je jen poslední číslice součinu a desítky se nepřičetly k dalšímu sloupci." },
    { value: correct % 10 ** n, why: "Poslední přenos se nezapsal. Když vynásobíš nejvyšší řád, zapiš celý výsledek i s přenosem." },
    { value: correct + 10, why: "Výsledek je o 10 větší — v desítkách je chyba v malé násobilce nebo v přičtení přenosu." },
    { value: correct - 10, why: "Výsledek je o 10 menší — v desítkách se zapomněl přičíst přenos nebo je chyba v malé násobilce." },
  ], [
    `Násobíš ${fmt(a)} × ${b}. Začni jednotkami: kolik je ${a % 10} × ${b}?`,
    `${a % 10} × ${b} = ${p0}: ${p0 >= 10 ? `zapiš ${p0 % 10} a ${Math.floor(p0 / 10)} si pamatuj jako přenos` : `zapiš ${p0}, přenos není`}. Pak násob desítky a přenos k nim přičti. Poslední přenos napiš celý na začátek výsledku.`,
  ], [
    `Zapíšeme ${fmt(a)} a pod jednotky ${b}. Násobíme zprava:`,
    ...sloupce(a, b),
    `Výsledek: ${fmt(correct)}`,
    `Odhad pro kontrolu: ${fmt(a)} je asi ${fmt(odhadA)} a ${fmt(odhadA)} × ${b} = ${fmt(odhadA * b)} — výsledek je blízko.`,
  ]);
}

function dvouciferny(a: number, b: number): PracticeTask {
  const u = b % 10, t = Math.floor(b / 10);
  const correct = a * b;
  const m1 = a * u, m2 = a * t;
  return ciselnaUloha(`${fmt(a)} × ${b} = ?`, correct, [
    { value: m1 + m2, why: `Druhý mezisoučet (${fmt(m2)}) se nezapsal o jedno místo vlevo. Násobíš desítkami, proto patří o řád výš.` },
    { value: m1 + m2 * 100, why: "Druhý mezisoučet je posunutý o dvě místa. Při násobení desítkami se posouvá jen o jedno." },
    { value: m2 * 10, why: `Chybí první mezisoučet — násobení jednotkami (${fmt(a)} × ${u}).` },
    { value: m1, why: `Chybí druhý mezisoučet — násobení desítkami (${fmt(a)} × ${t * 10}).` },
    { value: correct + 10, why: "Výsledek je o 10 větší — chyba při sčítání mezisoučtů nebo v přenosu." },
  ], [
    `Rozlož ${b} = ${t * 10} + ${u}. Kolik je ${fmt(a)} × ${u}?`,
    `První mezisoučet: ${fmt(a)} × ${u} = ${fmt(m1)}. Druhý: ${fmt(a)} × ${t} = ${fmt(m2)} — zapiš ho o jedno místo vlevo. Nakonec oba mezisoučty sečti.`,
  ], [
    `Násobíme ${fmt(a)} × ${b} = ${fmt(a)} × ${u} + ${fmt(a)} × ${t * 10}.`,
    `1. mezisoučet: ${fmt(a)} × ${u} = ${fmt(m1)}`,
    `2. mezisoučet: ${fmt(a)} × ${t} = ${fmt(m2)}, zapíšeme o jedno místo vlevo → ${fmt(m2 * 10)}`,
    `Sečteme: ${fmt(m1)} + ${fmt(m2 * 10)} = ${fmt(correct)}`,
    `Odhad: ${fmt(a)} × ${Math.round(b / 10) * 10} = ${fmt(a * Math.round(b / 10) * 10)} — výsledek je blízko.`,
  ]);
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 40; i++) {
    if (level === 1) tasks.push(jednociferny(rnd(100, 999), rnd(2, 9)));
    else if (level === 2) tasks.push(jednociferny(rnd(1000, 9999), rnd(2, 9)));
    else {
      let b = rnd(11, 99);
      while (b % 10 === 0) b = rnd(11, 99);
      tasks.push(dvouciferny(rnd(100, 999), b));
    }
  }
  return tasks;
}

export const PISEMNE_NASOBENI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-nasobeni-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-nasobeni-jedno-a-dvoucifernym-cinitelem",
    displayName: "Písemné násobení",
    title: "Písemné násobení jedno- a dvouciferným činitelem",
    studentTitle: "Násobení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se násobit větší čísla pod sebou.",
    keywords: [
      "násobení", "písemné násobení", "činitel", "součin",
      "přenos", "mezisoučet", "dvouciferný", "jednociferný",
    ],
    goals: [
      "Provést písemné násobení víceciferného čísla jednociferným činitelem.",
      "Provést písemné násobení víceciferného čísla dvouciferným činitelem (mezisoučty).",
      "Zkontrolovat výsledek odhadem.",
    ],
    boundaries: [
      "Dvojciferný činitel pouze do 99.",
      "Nezahrnuje násobení víceciferným × víceciferným (nad 2 cifry).",
      "Nezahrnuje desetinná čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-pisemne-deleni-jednociferne-4"],
    generator: gen,
    helpTemplate: {
      hint: "Násobíme zprava. Výsledek každé číslice zapíšeme, přenos přičteme k dalšímu sloupci. Dvouciferný činitel = dva mezisoučty, druhý posunutý o místo.",
      steps: [
        "Zapiš čísla pod sebe (menší dole).",
        "Násobíme spodní číslici jednotek s každou číslicí horního čísla zprava, přenosy si pamatuj.",
        "Výsledek zapíšeme (první mezisoučet).",
        "Při dvouciferném spodním: násobíme desítkami, výsledek posuneme o 1 místo vlevo (druhý mezisoučet).",
        "Sečteme mezisoučty → konečný výsledek.",
      ],
      commonMistake: "Zapomenutí posunout druhý mezisoučet o jedno místo vlevo při násobení dvouciferným činitelem.",
      example: "234 × 12:\n  234 × 2 = 468\n  234 × 10 = 2 340\n  468 + 2 340 = 2 808",
    },
  },
];
