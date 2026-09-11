import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fmt, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). L1 (dělenec do 50, dělitel 2–5)
// šla spočítat z malé násobilky a písemné dělení vůbec necvičila; postup
// ukazoval jen „d × q = …“ místo jednotlivých kroků; distraktory nebyly
// typické chyby a mohl vzniknout zápis „q zb. 0“. Teď:
// L1: dvojciferný dělenec, podíl aspoň 10, beze zbytku
// L2: trojciferný dělenec, beze zbytku, občas nula v podílu
// L3: tří- až čtyřciferný dělenec se zbytkem, často nula uprostřed podílu.

const zapis = (q: number, r: number) => (r > 0 ? `${q} zb. ${r}` : String(q));

function kroky(dividend: number, d: number): { steps: string[]; prvni: number; prvniQ: number; prvniR: number } {
  const cifry = String(dividend).split("").map(Number);
  const steps: string[] = [];
  let cur = 0, zacal = false, prvni = 0, prvniQ = 0, prvniR = 0;
  cifry.forEach((c, i) => {
    cur = cur * 10 + c;
    if (!zacal && cur < d && i < cifry.length - 1) return;
    const q = Math.floor(cur / d), r = cur - q * d;
    if (!zacal) {
      steps.push(`Vezmeme ${cur}: ${cur} ÷ ${d} = ${q}, zbytek ${r} (${d} × ${q} = ${d * q}).`);
      zacal = true; prvni = cur; prvniQ = q; prvniR = r;
    } else {
      steps.push(`Připíšeme ${c} → ${cur}: ${cur} ÷ ${d} = ${q}, zbytek ${r}${q === 0 ? " (do podílu píšeme 0)" : ""}.`);
    }
    cur = r;
  });
  return { steps, prvni, prvniQ, prvniR };
}

function uloha(q: number, d: number, r: number): PracticeTask {
  const dividend = d * q + r;
  const key = zapis(q, r);
  const { steps, prvni, prvniQ, prvniR } = kroky(dividend, d);
  const bezNul = Number(String(q).replace(/0/g, ""));
  const chyby = [
    ...(bezNul !== q && bezNul > 0 ? [{ value: zapis(bezNul, r), why: "Chybí nula v podílu. Když se dělitel do připsaného čísla nevejde, píše se do podílu 0 a pokračuje se dál." }] : []),
    ...(r > 0 ? [
      { value: zapis(q - 1, r + d), why: `Zbytek ${r + d} je větší než dělitel ${d} — dělení ještě nebylo dokončené, do podílu se vejde o 1 víc.` },
      { value: zapis(q, r === d - 1 ? r - 1 : r + 1), why: `Zbytek nesedí. Zkouška: ${d} × ${q} + zbytek musí dát ${fmt(dividend)}.` },
    ] : [
      { value: String(q + 1), why: `Zkouška: ${d} × ${q + 1} = ${fmt(d * (q + 1))}, to je víc než ${fmt(dividend)}.` },
    ]),
    { value: zapis(q + 10, r), why: "Jedna číslice podílu je o 1 větší — v desítkách je chyba. Ověř to zkouškou násobením." },
    { value: zapis(q - 10, r), why: "Jedna číslice podílu je o 1 menší — v desítkách je chyba. Ověř to zkouškou násobením." },
  ];
  return ciselnaUloha(`${fmt(dividend)} ÷ ${d} = ?`, key, chyby, [
    `Dělíš ${fmt(dividend)} ÷ ${d}. Začni zleva: kolikrát se ${d} vejde do ${prvni}?`,
    `${prvni} ÷ ${d} = ${prvniQ}, zbytek ${prvniR}. Ke zbytku připiš další číslici dělence a děl dál stejně. Když se ${d} nevejde, napiš do podílu 0. Nakonec udělej zkoušku násobením.`,
  ], [
    `Dělíme ${fmt(dividend)} ÷ ${d} písemně, zleva:`,
    ...steps,
    r > 0 ? `Podíl je ${fmt(q)}, zbytek ${r} → ${key}.` : `Podíl je ${fmt(q)}.`,
    `Zkouška: ${d} × ${fmt(q)}${r > 0 ? ` + ${r}` : ""} = ${fmt(dividend)}.`,
  ]);
}

function sNulou(): number {
  const q = rnd(100, 999);
  return Math.floor(q / 100) * 100 + (q % 10); // prostřední číslice 0
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 40; i++) {
    const d = rnd(2, 9);
    if (level === 1) {
      const q = rnd(10, Math.floor(99 / d));
      tasks.push(uloha(q, d, 0));
    } else if (level === 2) {
      const q = Math.random() < 0.3 ? Math.min(sNulou(), Math.floor(999 / d)) : rnd(Math.ceil(100 / d), Math.floor(999 / d));
      tasks.push(uloha(Math.max(q, 12), d, 0));
    } else {
      const q = Math.random() < 0.4 ? sNulou() : rnd(100, 999);
      tasks.push(uloha(q, d, rnd(1, d - 1)));
    }
  }
  return tasks;
}

export const PISEMNE_DELENI: TopicMetadata[] = [
  {
    id: "g4-mat-pisemne-deleni-jednociferne-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-jednocifernym-delitelem",
    displayName: "Písemné dělení",
    title: "Písemné dělení jednociferným dělitelem",
    studentTitle: "Dělení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Naučíš se dělit větší čísla pod sebou.",
    keywords: [
      "dělení", "písemné dělení", "dělitel", "dělenec", "podíl",
      "zbytek", "jednociferný dělitel",
    ],
    goals: [
      "Provést písemné dělení víceciferného čísla jednociferným dělitelem.",
      "Správně zapsat podíl i zbytek po dělení.",
      "Ověřit výsledek: dělitel × podíl + zbytek = dělenec.",
    ],
    boundaries: [
      "Pouze jednociferný dělitel (2–9).",
      "Nezahrnuje dělení dvojciferným nebo víceciferným dělitelem.",
      "Nezahrnuje desetinná čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4", "g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Dělíme zleva: vezmi tolik číslic, aby byl úsek ≥ děliteli, a zjisti, kolikrát se dělitel vejde.",
      steps: [
        "Zapiš dělenec a dělitel (např. 4 536 ÷ 4).",
        "Vezmi první číslici (4). 4 ÷ 4 = 1, zbytek 0.",
        "Přines další číslici → 05. 5 ÷ 4 = 1, zbytek 1.",
        "Přines → 13. 13 ÷ 4 = 3, zbytek 1.",
        "Přines → 16. 16 ÷ 4 = 4, zbytek 0.",
        "Výsledek: 1 134.",
      ],
      commonMistake: "Zapomenutí přinést zbytek k další číslici, nebo chybné umístění číslice podílu.",
      example: "846 ÷ 3 = 282  (8÷3=2 zb.2 → 24÷3=8 zb.0 → 6÷3=2)",
    },
  },
];
